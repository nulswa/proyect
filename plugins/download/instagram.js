export const run = {
   usage: ['instagram'],
   hidden: ['ig'],
   use: 'link',
   category: 'download',
   async: async (m, { client, args, isPrefix, setting, command, Utils }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://www.instagram.com/p/xxxx'), m)
         if (!args[0].match(/(https:\/\/www.instagram.com)/gi)) return client.reply(m.chat, `${setting.unlink}`, m)
         client.sendReact(m.chat, setting.timeLoad, m.key)
         let old = new Date()
         const json = await Api.neoxr('/ig', {
            url: Utils.igFixed(args[0])
         })
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         for (let v of json.data) {
            client.sendFile(m.chat, v.url, v.type == 'mp4' ? Utils.filename('mp4') : Utils.filename('jpg'), `${setting.emoji}  *Instagram - Download* :)`, m)
            await Utils.delay(1500)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true
}