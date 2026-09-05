import { parseFlags, applyTransformation, isImage, FLAG_MAP } from '@mochi/toolkit'

const enlaceSospechosoXd = /^https?:\/\/\S+\.(jpe?g|png|gif|webp|mp4)(\?.*)?$/i
const limteXd = 10

export const run = {
   usage: ['sticker'],
   hidden: ['s', 'sk'],
   use: 'reply',
   category: 'stickers',
   async: async (m, { client, text, setting, Utils, isPrefix, command }) => {
let examText = `${Utils.lineBase('Sticker : Edition')}
> ${setting.emoji2}  Crea stickers fácilmente o personalízalos para aplicar formas nuevas.

- *Formas :*
◦  *-c :* forma redondeada
◦  *-e :* forma de estrella
◦  *-co :* forma de corazon
◦  *-h :* forma en hexagonal
◦  *-t :* forma en triángulo

- *Efectos :*
◦  *-d :* usar efecto blur
◦  *-g :* cambiar a negro y blanco
◦  *-i :* invertir colores
◦  *-v :* invertir la imagen

> ${setting.emoji}  Puedes mezclar las formas y efectos.
- *Las formas y efectos solo aplican para imágenes.*

${Utils.example(isPrefix, command, '-c')}`
      const args = text?.trim().split(/\s+/).filter(Boolean) || []

      const urlArg = args.find(a => enlaceSospechosoXd.test(a)) || null
      const flagArgs = args.filter(a => !enlaceSospechosoXd.test(a))
      const { shapes, effects } = parseFlags(flagArgs)

      const q = m.quoted ? m.quoted : m
      const mime = (q.msg || q).mimetype || ''

      const esImg = q.mtype === 'imageMessage' || /^image\//i.test(mime)
      const esVid = q.mtype === 'videoMessage' || /^video\//i.test(mime)
      const esSticker = q.mtype === 'stickerMessage'
      const esAnimado = esSticker && (q.msg?.isAnimated || /gif/i.test(mime))
      const tieneMedia = esImg || esVid || esSticker

      if (!tieneMedia && !urlArg) {
         return client.reply(m.chat, examText, m)
      }

      const packname = setting.sk_pack
      const author = setting.sk_author

      await client.sendReact(m.chat, setting.timeLoad, m.key)

      try {
         let buffer

         if (urlArg) {
            const res = await fetch(urlArg, { headers: { 'User-Agent': 'Mozilla/5.0' } })
            if (!res.ok) throw new Error(`No se pudo descargar la URL (${res.status})`)
            buffer = Buffer.from(await res.arrayBuffer())

            const ext = urlArg.split('?')[0].split('.').pop().toLowerCase()
            const esVidUrl = ['mp4', 'gif'].includes(ext)

            if (esVidUrl) {
               return await client.sendSticker(m.chat, buffer, m, { packname, author, meta: true })
            } else {
               if (shapes.length || effects.length) {
                  buffer = await applyTransformation(buffer, shapes, effects)
               }
               return await client.sendSticker(m.chat, buffer, m, { packname, author, meta: true })
            }
         }

         buffer = await q.download()
         if (!buffer?.length) throw new Error('No se pudo descargar el contenido.')

         if (esVid) {
            const segundos = q.msg?.seconds || 0
            if (segundos > limteXd) {
               return client.reply(m.chat, `${setting.emoji}  El video no debe durar más de *${limteXd} segundos*.`, m)
            }
            return await client.sendSticker(m.chat, buffer, m, { packname, author, meta: true })
         }

         if (esSticker && esAnimado) {
            return await client.sendSticker(m.chat, buffer, m, { packname, author, meta: true })
         }

         if (esSticker && !esAnimado) {
            if (shapes.length || effects.length) {
               buffer = await applyTransformation(buffer, shapes, effects)
            }
            return await client.sendSticker(m.chat, buffer, m, { packname, author, meta: true })
         }

         if (esImg) {
            if (shapes.length || effects.length) {
               const valida = await isImage(buffer)
               if (!valida) throw new Error('El archivo no es una imagen válida.')
               buffer = await applyTransformation(buffer, shapes, effects)
            }
            return await client.sendSticker(m.chat, buffer, m, { packname, author, meta: true })
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
