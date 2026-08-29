export const run = {
   usage: ['gdrive'],
   use: 'link',
   category: 'download',
   async: async (m, { client, args, isPrefix, command, setting, users, Config, Utils, Scraper }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://drive.google.com/file/d/xxxx'), m)
         client.sendReact(m.chat, setting.timeLoad, m.key)
         const json = await Api.neoxr('/gdrive', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, `${setting.nosear}`, m)
         const size = await Utils.getSizeFromUrl(json.data.url)
         const chSize = Utils.sizeLimit(size, users.premium ? Config.max_upload : Config.max_upload_free)
         const isOver = users.premium ? `${setting.emoji}  El archivo pesa *${size}MB* descárgalo tú mismo en : ${await (await Scraper.shorten(json.data.url)).data.url}` : `${setting.emoji}  El archivo pesa *${size}MB*, supera los *${Config.max_upload_free}MB* gratuitos para descargar.\n- Actualiza a *Premium* para descargar archivos de hasta : *${Config.max_upload}MB*`
         if (chSize.oversize) return client.reply(m.chat, isOver, m)
         client.sendFile(m.chat, json.data.url, '', '', m)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: false
}