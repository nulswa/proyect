export const run = {
   usage: ['wame'],
   category: 'group',
   async: async (m, { client, text, setting }) => {
      let number = m.quoted ? (m.quoted.sender).split`@` [0] : (m.sender).split`@` [0]
      let chat = text ? text : setting.nameMark
      client.reply(m.chat, `${setting.emoji2}  : https://wa.me/${number}?text=${encodeURI(chat)}`, m)
   },
   error: false
}