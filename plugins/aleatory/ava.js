export const run = {
   usage: ['ava'],
   use: 'mention',
   category: 'aleatory',
   async: async (m, { client, setting, text, Utils }) => {
      let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@` [1]) : text
      if (!text && !m.quoted) return client.reply(m.chat, `${setting.emoji2}  Mencioné o responda a un usuario.`, m)
      if (isNaN(number)) return client.reply(m.chat, `${setting.emoji}  El número no es valido.`, m)
      if (number.length > 15) return client.reply(m.chat, `${setting.emoji}  El formato no es valido.`, m)
      try {
         if (text) {
            var user = number + '@s.whatsapp.net'
         } else if (m.quoted.sender) {
            var user = m.quoted.sender
         } else if (m.mentionedJid) {
            var user = number + '@s.whatsapp.net'
         }
      } catch (e) {} finally {
         var pic = false
         try {
            var pic = await client.profilePictureUrl(user, 'image')
         } catch {} finally {
            if (!pic) return client.reply(m.chat, `${setting.emoji2}  ${setting.sucs} :)`, m)
            client.sendFile(m.chat, pic, '', '', m)
         }
      }
   },
   error: false
}
