export const run = {
   usage: ['afk'],
   use: 'text',
   category: 'group',
   async: async (m, { client, setting, text, Utils }) => {
      try {
         let user = global.db.users.find(v => v.jid == m.sender)
         user.afk = +new Date
         user.afkReason = text
         user.afkObj = m
         let tag = m.sender.split`@` [0]
         return client.reply(m.chat, `${setting.emoji2}  ¡El usuario @${tag} está en *AFK*!\n- No molestar.`, m)
      } catch {
         client.reply(m.chat, setting.erroBot, m)
      }
   },
   error: false,
   group: true
}
