import path from 'path'
import fs from 'fs/promises'
import { writeFileSync, readFileSync } from 'fs'
import crypto from 'crypto'
import { execSync } from 'child_process'
import sharp from 'sharp'

const TEMP_DIR = path.join(process.cwd(), 'temp')

async function tempFile(ext) {
   await fs.mkdir(TEMP_DIR, { recursive: true })
   return path.join(TEMP_DIR, `${Date.now()}_${crypto.randomUUID()}.${ext}`)
}

async function tempFramesDir() {
   const dir = path.join(TEMP_DIR, `frames_${Date.now()}_${crypto.randomUUID()}`)
   await fs.mkdir(dir, { recursive: true })
   return dir
}

async function clean(...ps) {
   for (const p of ps) if (p) await fs.rm(p, { recursive: true, force: true }).catch(() => {})
}

async function webpAnimToMp4(webpBuffer, output) {
   const framesDir = await tempFramesDir()
   try {
      const meta = await sharp(webpBuffer, { animated: true }).metadata()
      const pages = meta.pages || 1
      const delay = (meta.delay?.[0]) || 100

      for (let i = 0; i < pages; i++) {
         const frameBuffer = await sharp(webpBuffer, { animated: false, page: i })
            .png()
            .toBuffer()
         writeFileSync(path.join(framesDir, `frame_${String(i).padStart(4, '0')}.png`), frameBuffer)
      }

      const fps = Math.max(Math.round(1000 / delay), 1)
      execSync(
         `ffmpeg -y -framerate ${fps} -i "${framesDir}/frame_%04d.png" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" -c:v libx264 -movflags +faststart "${output}"`,
         { stdio: 'pipe', timeout: 90000 }
      )
   } finally {
      await clean(framesDir)
   }
}

export const run = {
   usage: ['toimg', 'togif'],
   use: 'reply',
   category: 'converter',
   async: async (m, { client, setting: exif, Utils, command }) => {
      const q = m.quoted ? m.quoted : m
      const mtype = q.mtype
      const mime = (q.msg || q).mimetype || ''

      const esSticker = mtype === 'stickerMessage' || /webp/i.test(mime)
      const esVideo = mtype === 'videoMessage'

      if (command === 'toimg') {
         if (!esSticker) {
            return client.reply(m.chat, `${exif.emoji}  Responda a un sticker *sin animación* para convertirlo en imagen.`, m)
         }

         await client.sendReact(m.chat, exif.timeLoad, m.key)
         let i, o
         try {
            const buffer = await q.download()
            if (!buffer?.length) throw new Error('Sin buffer')
            i = await tempFile('webp')
            o = await tempFile('png')
            writeFileSync(i, buffer)
            execSync(`ffmpeg -y -i "${i}" -vframes 1 -c:v png "${o}"`, { stdio: 'pipe' })
            return await client.sendFile(m.chat, readFileSync(o), 'toimg.png', '', m)
         } catch (e) {
            console.log('[toimg]', e)
            return client.reply(m.chat, Utils.jsonFormat(e), m)
         } finally {
            await clean(i, o)
         }
      }

      if (command === 'togif') {
         if (!esVideo && !esSticker) {
            return client.reply(m.chat, `${exif.emoji}  Responda a un *video* o *sticker animado* para convertirlo en gif.`, m)
         }
         if (esVideo && (q.msg?.seconds || 0) >= 15) {
            return client.reply(m.chat, `${exif.emoji}  La *animación* supera los *15 segundos*.\n- No fue posible convertirlo en gif.`, m)
         }

         await client.sendReact(m.chat, exif.timeLoad, m.key)
         let i, o
         try {
            const buffer = await q.download()
            if (!buffer?.length) throw new Error('Sin buffer')
            o = await tempFile('mp4')

            if (esSticker) {
               await webpAnimToMp4(buffer, o)
            } else {
               i = await tempFile('mp4')
               writeFileSync(i, buffer)
               execSync(
                  `ffmpeg -y -i "${i}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" -c:v libx264 -movflags +faststart "${o}"`,
                  { stdio: 'pipe', timeout: 60000 }
               )
            }

            return await client.sendFile(m.chat, readFileSync(o), 'togif.mp4', '', m, { mimetype: 'video/mp4', gifPlayback: true })
         } catch (e) {
            console.log('[togif]', e)
            return client.reply(m.chat, Utils.jsonFormat(e), m)
         } finally {
            await clean(i, o)
         }
      }
   },
   error: false
}
