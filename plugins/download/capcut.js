export const run = {
   usage: ['capcut'],
   hidden: ['cc'],
   use: 'link',
   category: 'download',
   async: async (m, { client, args, setting, isPrefix, command, Utils }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://www.capcut.com/watch/xxxx'), m)
         client.sendReact(m.chat, setting.timeLoad, m.key)
         const json = await Api.neoxr('/capcut', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         client.sendFile(m.chat, json.data.url, '', json.data.caption, m)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true
}