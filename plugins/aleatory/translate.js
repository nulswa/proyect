import translate from 'translate-google-api'

export const run = {
   usage: ['translate'],
   hidden: ['tr'],
   use: 'text',
   category: 'utilities',
   async: async (m, { client, text, setting, isPrefix, command, Utils }) => {
      if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'en Soy de argentina'), m)
      if (text && m.quoted && m.quoted.text) {
         let lang = text.slice(0, 2)
         try {
            let data = m.quoted.text
            let result = await translate(`${data}`, {
               to: lang
            })
            client.reply(m.chat, result[0], m)
         } catch {
            return client.reply(m.chat, `${setting.emoji}  Lenguaje no soportado.`, m)
         }
      } else if (text) {
         let lang = text.slice(0, 2)
         try {
            let data = text.substring(2).trim()
            let result = await translate(`${data}`, {
               to: lang
            })
            client.reply(m.chat, result[0], m)
         } catch {
            return client.reply(m.chat, `${setting.emoji}  Lenguaje no soportado.`, m)
         }
      }
   },
   error: false
}