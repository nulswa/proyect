export const run = {
   usage: ['facebook'],
   hidden: ['fb'],
   use: 'link',
   category: 'download',
   async: async (m, { client, args, setting, isPrefix, command, users, Config, Utils }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://fb.watch/xxxx'), m)
         if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) return client.reply(m.chat, setting.unlink, m)
         client.sendReact(m.chat, setting.timeLoad, m.key)
         const json = await Api.neoxr('/fb', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         let result = json.data.find(v => v.quality == 'HD' && v.response == 200)
         if (result) {
            const size = await Utils.getSizeFromUrl(result.url)
            const chSize = Utils.sizeLimit(size, users.premium ? Config.max_upload : Config.max_upload_free)
            const isOver = users.premium ? `${setting.emoji}  El archivo pesa *${size}MB* descárgalo tú mismo en : ${await (await Scraper.shorten(result.url)).data.url}` : `${setting.emoji}  El archivo pesa *${size}MB*, supera los *${Config.max_upload_free}MB* gratuitos para descargar.\n- Actualiza a *Premium* para descargar archivos de hasta : *${Config.max_upload}MB*`
            if (chSize.oversize) return client.reply(m.chat, isOver, m)
            client.sendFile(m.chat, result.url, Utils.filename('mp4'), `${setting.emoji2}  *Facebook - Download* :)`, m)
         } else {
            let result = json.data.find(v => v.quality == 'SD' && v.response == 200)
            if (!result) return client.reply(m.chat, global.status.fail, m)
            const size = await Utils.getSizeFromUrl(result.url)
            const chSize = Utils.sizeLimit(size, users.premium ? Config.max_upload : Config.max_upload_free)
            const isOver = users.premium ? `${setting.emoji}  El archivo pesa *${size}MB* descárgalo tú mismo en : ${await (await Scraper.shorten(result.url)).data.url}` : `${setting.emoji}  El archivo pesa *${size}MB*, supera los *${Config.max_upload_free}MB* gratuitos para descargar.\n- Actualiza a *Premium* para descargar archivos de hasta : *${Config.max_upload}MB*`
            if (chSize.oversize) return client.reply(m.chat, isOver, m)
            client.sendFile(m.chat, result.url, Utils.filename('mp4'), `${setting.emoji2}  *Facebook - Download* :)`, m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true
}