export const run = {
   usage: ['twitter'],
   hidden: ['tw', 'x'], 
   use: 'link', 
   category: 'download',
   async: async (m, { client, setting, args, isPrefix, command, Utils }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://twitter.com/xxxx'), m)
         if (!args[0].match(/(x.com)/gi)) return client.reply(m.chat, `${setting.unlink}`, m)
         client.sendReact(m.chat, setting.timeLoad, m.key)
         const json = await Api.neoxr('/twitter', {
            url: args[0]
         })
         let old = new Date()
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         for (let v of json.data) {
            if (/jpg|mp4/.test(v.type)) {
               client.sendFile(m.chat, v.url, `file.${v.type}`, `${setting.emoji2}  *Twitter - Download* :)`, m)
            } else if (/gif/.test(v.type)) {
               client.sendFile(m.chat, v.url, 'file.mp4', `${setting.emoji2}  *Twitter - Download* :)`, m, {
                  gif: true
               })
            }
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true

}
