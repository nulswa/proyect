export const run = {
   usage: ['ping'],
   hidden: ["p"],
   category: 'information',
   async: async (m, { client, setting }) => {
      const start = Date.now()
      const msg = await client.reply(m.chat, 'Loading...', m)
      const end = Date.now()
      client.sendMessage(m.chat, { text: `${setting.emoji2}  *Speed :* ${end - start}ms`, edit: msg.key })
   },
   error: false
}