import path from 'path'
import fs from 'fs/promises'
import { writeFileSync, readFileSync } from 'fs'
import crypto from 'crypto'
import { execSync } from 'child_process'

const temp_dir = path.join(process.cwd(), 'temp')
const speeds = [0.25, 0.5, 1.5, 2, 3]

async function tempFile(ext) {
   await fs.mkdir(temp_dir, { recursive: true })
   return path.join(temp_dir, `${Date.now()}_${crypto.randomUUID()}.${ext}`)
}

async function clean(...ps) {
   for (const p of ps) if (p) await fs.unlink(p).catch(() => {})
}

export const run = {
   usage: ['tovideo', 'reverse', 'speed'],
   use: 'reply',
   category: 'converter',
   async: async (m, { client, command, text, setting, Utils, isPrefix }) => {
      const q = m.quoted ? m.quoted : m
      const mtype = q.mtype

      if (command === 'tovideo') {
         if (mtype !== 'audioMessage') {
            return client.reply(m.chat, `${setting.emoji2}  Responda a un audio *(mp3)* para convertirlo en un video.`, m)
         }
         await client.sendReact(m.chat, setting.timeLoad, m.key)
         let i, o
         try {
            const buffer = await q.download()
            if (!buffer?.length) throw new Error('Sin buffer')
            i = await tempFile('mp3')
            o = await tempFile('mp4')
            writeFileSync(i, buffer)
            execSync(`ffmpeg -y -f lavfi -i color=c=black:s=1280x720:r=1 -i "${i}" -shortest -c:v libx264 -c:a aac -strict experimental "${o}"`, { stdio: 'pipe', timeout: 60000 })
            return await client.sendFile(m.chat, readFileSync(o), 'tovideo.mp4', '', m, { mimetype: 'video/mp4' })
         } catch (e) {
            console.log('[tovideo]', e)
            return client.reply(m.chat, Utils.jsonFormat(e), m)
         } finally {
            await clean(i, o)
         }
      }
      if (mtype !== 'videoMessage') {
         return client.reply(m.chat, `${exif.emoji}  Responda a un video para aplicar el efecto.`, m)
      }
      let i, o
      try {
         const buffer = await q.download()
         if (!buffer?.length) throw new Error('Sin buffer')
         i = await tempFile('mp4')
         o = await tempFile('mp4')
         writeFileSync(i, buffer)

         if (command === 'reverse') {
            await client.sendReact(m.chat, setting.timeLoad, m.key)
            execSync(`ffmpeg -y -i "${i}" -vf reverse -af areverse "${o}"`, { stdio: 'pipe', timeout: 60000 })
         } else if (command === 'speed') {
            const speed = parseFloat(text)
         const prefix = isPrefix || '.'
      const examText = `${Utils.lineBase('Speed')}
> ${setting.emoji2}  Aplique una velocidad para continuar con el video.

- *Opciones :*
◦  *0.25 :* Camara lenta *x4*
◦  *0.5 :* Camara lenta *x2*
◦  *1.5 :* Camara rapida *x1.5*
◦  *2 :* Camara rapida *x2*
◦  *3 :* Camara rapida *x3*

${setting.emoji}  Recuerde responder solo a un video para aplicar el efecto.

${Utils.example(isPrefix, command, '0.5')}`
            if (!speeds.includes(speed)) return client.reply(m.chat, examText, m)

            await client.sendReact(m.chat, setting.timeLoad, m.key)
            const vf = `setpts=${(1 / speed).toFixed(4)}*PTS`
            const af = `atempo=${speed <= 0.5 ? 0.5 : speed >= 2 ? 2 : speed}`
            execSync(`ffmpeg -y -i "${i}" -vf "${vf}" -af "${af}" "${o}"`, { stdio: 'pipe', timeout: 60000 })
         }
         return await client.sendFile(m.chat, readFileSync(o), 'video.mp4', '', m, { mimetype: 'video/mp4' })
      } catch (e) {
         console.log('[reverse/velv]', e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      } finally {
         await clean(i, o)
      }
   },
   error: false
}
