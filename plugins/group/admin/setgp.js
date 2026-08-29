export const run = {
   usage: ['setdesc', 'setname'],
   use: 'text',
   category: 'admin group',
   async: async (m, { client, text, setting, isPrefix, command, Utils }) => {
      let value = m.quoted ? m.quoted.text : text
      if (command == 'setname') {
         if (!value) return client.reply(m.chat, Utils.example(isPrefix, command, `${setting.nameMark}`), m)
         if (value > 25) return client.reply(m.chat, `${setting.emoji}  Límite : *25* características.`, m)
         await client.groupUpdateSubject(m.chat, value)
      } else if (command == 'setdesc') {
     	if (!value) return client.reply(m.chat, Utils.example(isPrefix, command, `Sean bienvenidos a todos en éste grupo.`), m)
         await client.groupUpdateDescription(m.chat, value)
      }
   },
   group: true,
   admin: true,
   botAdmin: true
}