export const run = {
   usage: ['s-lock', 's-prem', 's-ai'],
   use: 'reply',
   category: 'stickers',
   async: async (m, { client, command, setting, Utils }) => {
      try {
         const q = m.quoted ? m.quoted : m
         const mime = (q.msg || q).mimetype || ''
         if (/image\/(jpe?g|png|webp)/.test(mime)) {
            const buffer = await q.download()
            if (!buffer) return client.reply(m.chat, `${setting.emoji}  Responda a un vídeo o imagen.`, m)
            await client.sendReact(m.chat, setting.timeLoad, m.key)
            client.sendSticker(m.chat, buffer, m, {
               packname: setting.sk_pack,
               author: setting.sk_author, ...(command === 's-lock' ? { lock: true } : command === 's-prem' ? { premium: true } : command === 's-ai' ? { meta: true } : {} )
            })
         } else if (/video/.test(mime)) {
            if ((q.msg || q).seconds > 10) return client.reply(m.chat, `${setting.emoji}  El vídeo no debe durar más de *10* segundos.`, m)
            const buffer = await q.download()
            if (!buffer) return client.reply(m.chat, `${setting.emoji}  Responda a un vídeo o imagen.`, m)
            await client.sendReact(m.chat, setting.timeLoad, m.key)
            client.sendSticker(m.chat, buffer, m, {
               packname: setting.sk_pack,
               author: setting.sk_author, ...(command === 's-lock' ? { lock: true } : command === 's-prem' ? { premium: true } : command === 's-ai' ? { meta: true } : {} )
            })
         } else client.reply(m.chat, `${setting.emoji2}  Responda a un vídeo o imagen.`, m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
