import { decode } from 'html-entities'

export const run = {
   usage: ['mediafire'],
   hidden: ['mf'],
   use: 'link',
   category: 'download',
   async: async (m, { client, args, isPrefix, command, users, setting, Config, Utils }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://www.mediafire.com/file/xxxx'), m)
         if (!args[0].match(/(https:\/\/www.mediafire.com\/)/gi)) return client.reply(m.chat, `${setting.unlink}`, m)
         client.sendReact(m.chat, setting.timeLoad, m.key)
         const json = await Api.neoxr('/mediafire', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
let text = `${Utils.lineBase('Mediafire - Download')}

> ${unescape(decode(json.data.title))}

◦  *Peso :* ${json.data.size}
◦  *Extensión :* ${json.data.extension}
◦  *Paquete :* ${json.data.mime}

${setting.botDesc}`
         const chSize = Utils.sizeLimit(json.data.size, users.premium ? Config.max_upload : Config.max_upload_free)
         const isOver = users.premium ? `${setting.emoji}  El archivo pesa *${json.data.size}MB* descárgalo tú mismo en : ${await (await Scraper.shorten(json.data.url)).data.url}` : `${setting.emoji}  El archivo pesa *${json.data.size}MB*, supera los *${Config.max_upload_free}MB* gratuitos para descargar.\n- Actualiza a *Premium* para descargar archivos de hasta : *${Config.max_upload}MB*`
         if (chSize.oversize) return client.reply(m.chat, isOver, m)
         client.reply(m.chat, text, m).then(async () => {
            client.sendFile(m.chat, json.data.url, unescape(decode(json.data.title)), '', m)
         })
      } catch (e) {
         console.log(e)
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true
}