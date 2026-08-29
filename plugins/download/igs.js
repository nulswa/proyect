export const run = {
   usage: ['igstory'],
   hidden: ['instory'],
   use: 'link',
   category: 'download',
   async: async (m, { client, args, isPrefix, setting, command, Utils }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://instagram.com/stories/xxxx'), m)
         client.sendReact(m.chat, setting.timeLoad, m.key)
         let old = new Date()
         const json = await Api.neoxr('/ig-fetch', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, `${setting.nosear}`, m)
         for (let v of json.data) {
            const file = await Utils.getFile(v.url)
            client.sendFile(m.chat, v.url, Utils.filename(/mp4|bin/.test(file.extension) ? 'mp4' : 'jpg'), `${setting.emoji2}  *Instagram - Download*`, m)
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