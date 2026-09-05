export const run = {
   usage: ['smeme'],
   use: 'text',
   category: 'stickers',
   async: async (m, { client, text, isPrefix, setting, command, Utils, Scraper }) => {
      try {
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'Hola | Hola'), m)
         client.sendReact(m.chat, setting.timeLoad, m.key)
         let [top, bottom] = text.split`|`
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               let img = await client.downloadMediaMessage(q)
               let json = await Scraper.uploadImageV2(img)
               let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
               client.sendSticker(m.chat, res, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
            } else client.reply(m.chat, `${setting.emoji}  Solo puedes responder a una imagen.`, m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, `${setting.emoji}  Responda a una imagen.`, m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, `${setting.emoji}  Solo puedes responder una imagen.`, m)
            let img = await q.download()
            let json = await Scraper.uploadImageV2(img)
            let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
            client.sendSticker(m.chat, res, m, {
               packname: setting.sk_pack,
               author: setting.sk_author
            })
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
