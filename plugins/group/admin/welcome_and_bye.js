export const run = {
   usage: ['setwelcome', 'setbye'],
   hidden: ['setleft'],
   use: 'text',
   category: 'admin group',
   async: async (m, { client, text, isPrefix, setting, command, Utils }) => {
let formatText = `${setting.emoji}  Edite el mensaje de texto para la *Despedida* o *Bienvenida* del chat grupal. :)

> *Formatos disponibles :*
*+tag :* menciona al usuario
*+grup :* menciona el nombre grupal

${setting.emoji2}  Ambos formatos sirven lo mismo para:
*${isPrefix}setwelcome* - text
*${isPrefix}setbye* - text 

${Utils.example(isPrefix, command, 'Hola +tag, este es el grupo +grup')}`,
      let setup = global.db.groups.find(v => v.jid == m.chat)
      if (command == 'setwelcome') {
         if (!text) return client.reply(m.chat, formatText, m)
         setup.text_welcome = text
         await client.reply(m.chat, `${setting.emoji2}  ${setting.sucs} :)`, m)
      } else if (/set(bye|left)/i.test(command)) {
         if (!text) return client.reply(m.chat, formatText, m)
         setup.text_left = text
         await client.reply(m.chat, `${setting.emoji2}  ${setting.sucs} :)`, m)
      }
   },
   admin: true
}