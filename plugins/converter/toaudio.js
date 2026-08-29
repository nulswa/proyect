import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'
import { execSync } from 'child_process'

const TEMP_DIR = path.join(process.cwd(), 'temp')

async function tempFile(ext) {
   await fs.mkdir(TEMP_DIR, { recursive: true })
   return path.join(TEMP_DIR, `${Date.now()}_${crypto.randomUUID()}.${ext}`)
}

async function clean(...ps) {
   for (const p of ps) if (p) await fs.unlink(p).catch(() => {})
}

export const run = {
   usage: ['toaudio', 'todoc'],
   use: 'reply',
   category: 'converter',
   async: async (m, { client, setting: exif, Utils, command }) => {
      const q = m.quoted ? m.quoted : m
      const mtype = q.mtype

      if (command === 'todoc' || command === 'todocumento') {
         if (mtype !== 'videoMessage' && mtype !== 'audioMessage') {
            return client.reply(m.chat, `${exif.emoji}  Responda a un vídeo.`, m)
         }

         await client.sendReact(m.chat, exif.timeLoad, m.key)

         try {
            const isVid = mtype === 'videoMessage'
            const buffer = await q.download()
            if (!buffer?.length) throw new Error('No se pudo obtener el buffer.')

            return await client.sendFile(m.chat, buffer, isVid ? 'archivo.mp4' : 'archivo.mp3', '', m, {
               mimetype: isVid ? 'video/mp4' : 'audio/mpeg',
               asDocument: true
            })
         } catch (e) {
            console.log('[todoc]', e)
            return client.reply(m.chat, Utils.jsonFormat(e), m)
         }
      }

      if (mtype !== 'videoMessage') {
         return client.reply(m.chat, `${exif.emoji}  Responda a un vídeo.`, m)
      }

      await client.sendReact(m.chat, exif.timeLoad, m.key)

      let i, o
      try {
         const buffer = await q.download()
         if (!buffer?.length) throw new Error('No se pudo obtener el buffer.')

         i = await tempFile('mp4')
         o = await tempFile('mp3')
         await fs.writeFile(i, buffer)

         execSync(`ffmpeg -y -i "${i}" -vn -acodec libmp3lame -q:a 2 "${o}"`, { stdio: 'pipe', timeout: 60000 })

         const audioBuf = await fs.readFile(o)
         return await client.sendFile(m.chat, audioBuf, 'audio.mp3', '', m, { mimetype: 'audio/mpeg', ptt: false })
      } catch (e) {
         console.log('[toaudio]', e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      } finally {
         await clean(i, o)
      }
   },
   error: false
}
