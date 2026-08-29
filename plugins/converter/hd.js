import fetch from 'node-fetch'
import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'
import { spawn } from 'child_process'

const TEMP_DIR = path.join(process.cwd(), 'temp')

async function tempFile(ext) {
   await fs.mkdir(TEMP_DIR, { recursive: true })
   return path.join(TEMP_DIR, `${Date.now()}_${crypto.randomUUID()}.${ext}`)
}

async function hdEnhance(inputBuf, timeoutMs = 20000) {
   const API = 'https://us-central1-vector-ink.cloudfunctions.net/upscaleImage'
   const out = { ok: false }
   let inP, outP

   try {
      const controller = new AbortController()
      const fetchTimer = setTimeout(() => controller.abort(), timeoutMs)

      let r
      try {
         r = await fetch(API, {
            method: 'POST',
            headers: { 'content-type': 'application/json', origin: 'https://vectorink.io', referer: 'https://vectorink.io/', 'user-agent': 'Mozilla/5.0' },
            body: JSON.stringify({ data: { image: inputBuf.toString('base64') } }),
            signal: controller.signal
         })
      } catch (e) {
         out.error = e.name === 'AbortError' ? 'timeout_api' : e.message
         return out
      } finally {
         clearTimeout(fetchTimer)
      }

      if (!r.ok) { out.error = `HTTP ${r.status}`; return out }

      const j = JSON.parse(await r.text().catch(() => '{}'))
      const inner = JSON.parse(j?.result || '{}')
      const webpB64 = inner?.image?.b64_json
      if (!webpB64) { out.error = 'no_b64'; return out }

      const webpBuf = Buffer.from(webpB64, 'base64')
      inP = await tempFile('webp')
      outP = await tempFile('png')
      await fs.writeFile(inP, webpBuf)

      await new Promise((res, rej) => {
         const p = spawn('ffmpeg', ['-y', '-i', inP, '-frames:v', '1', outP], { stdio: 'ignore' })

         const killTimer = setTimeout(() => {
            p.kill('SIGKILL')
            rej(new Error('timeout_ffmpeg'))
         }, timeoutMs)

         p.on('close', c => {
            clearTimeout(killTimer)
            c === 0 ? res() : rej(new Error('ffmpeg failed'))
         })
         p.on('error', e => {
            clearTimeout(killTimer)
            rej(e)
         })
      })

      out.ok = true
      out.buffer = await fs.readFile(outP)
      return out
   } catch (e) {
      out.error = e.message
      return out
   } finally {
      if (inP) await fs.unlink(inP).catch(() => {})
      if (outP) await fs.unlink(outP).catch(() => {})
   }
}

export const run = {
   usage: ['hd'],
   use: 'reply',
   category: 'converter',
   async: async (m, { client, setting, Utils }) => {
      const q = m.quoted ? m.quoted : m
      const mime = (q.msg || q).mimetype || ''

      if (!mime.startsWith('image/')) {
         return client.reply(m.chat, `${setting.emoji}  Responda a una imágen.`, m)
      }

      await client.sendReact(m.chat, setting.timeLoad, m.key)

      try {
         const buffer = await q.download()
         if (!buffer?.length) throw new Error('No se pudo obtener el buffer.')

         const result = await hdEnhance(buffer)
         if (!result.ok) {
            return client.reply(m.chat, `${setting.nosear}`, m)
         }

         return await client.sendMessage(m.chat, { image: { url: result.buffer }, caption: `${setting.emoji2}  ${setting.sucs} :)` }, { quoted: m })
         //client.sendFile(m.chat, result.buffer, 'hd.png', '', m)
      } catch (e) {
         console.log('[hd]', e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
