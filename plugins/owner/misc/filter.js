export const run = {
   async: async (m, {
      client,
      body,
      users,
      groupSet,
      setting,
      isAdmin,
      setting,
      isBotAdmin,
      Utils
   }) => {
      try {
         if (groupSet.filter && !isAdmin && isBotAdmin && !m.fromMe) {
            let toxic = setting.toxic
            if (body && (new RegExp('\\b' + toxic.join('\\b|\\b') + '\\b')).test(body.toLowerCase())) {
               groupSet.member[m.sender].warning += 1
               let warning = groupSet.member[m.sender].warning
               if (warning > 4) return client.reply(m.chat, `${setting.emoji}  Llegaste a 5 advertencias maximo.\n- Serás eliminado.`, m).then(() => {
                  client.groupParticipantsUpdate(m.chat, [m.sender], 'remove').then(async () => {
                     groupSet.member[m.sender].warning = 0
                     client.sendMessage(m.chat, {
                        delete: {
                           remoteJid: m.chat,
                           fromMe: isBotAdmin ? false : true,
                           id: m.key.id,
                           participant: m.sender
                        }
                     })
                  })
               })
               return client.reply(m.chat, `${setting.emoji}  Acumulaste *${warning}* de *5* advertencias.\n- Serás eliminado tras cumplir las *5* advertencias.`, m).then(() => client.sendMessage(m.chat, {
                  delete: {
                     remoteJid: m.chat,
                     fromMe: isBotAdmin ? false : true,
                     id: m.key.id,
                     participant: m.sender
                  }
               }))
            }
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   group: true
}