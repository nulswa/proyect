export const run = {
   usage: ['everyone'],
   hidden: ['tagall'],
   use: 'text',
   category: 'admin group',
   async: async (m, { client, setting, text, participants, Utils }) => {
      try {
         let member = participants.map(v => v.id)
         let readmore = String.fromCharCode(8206).repeat(4001)
         let message = (!text) ? 'Hola a todos.' : text
         client.reply(m.chat, `${Utils.lineBase('Everyone')}\n${readmore}\n${member.map(v => '×  @' + v.replace(/@.+/, '')).join('\n')}\n*${message}*`, m)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   admin: true,
   group: true
}
