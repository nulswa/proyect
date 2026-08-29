export const run = {
   usage: ['threads'],
   hidden: ['th'],
   use: 'link',
   category: 'download',
   async: async (m, { client, args, isPrefix, setting, command, Utils }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://www.threads.net/xxxx'), m)
         client.sendReact(m.chat, setting.timeLoad, m.key)
         let old = new Date()
         const json = await Api.neoxr('/threads', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         for (let v of json.data) {
            client.sendFile(m.chat, v.url, v.type == 'mp4' ? Utils.filename('mp4') : Utils.filename('jpg'), `${setting.emoji2}  *Threads - Download* :)`, m)
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