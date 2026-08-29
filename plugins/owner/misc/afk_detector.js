export const run = {
   async: async (m, {
      client,
      body,
      setting,
      users,
      Utils
   }) => {
      try {
         let afk = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
         for (let jid of afk) {
            let is_user = global.db.users.find(v =>
               v.jid == jid || v.lid === jid
            )
            if (!is_user) continue
            let afkTime = is_user.afk
            if (!afkTime || afkTime < 0) continue
            let reason = is_user.afkReason || ''
            if (!m.fromMe) {
               client.reply(m.chat, `${setting.emoji2}  El usuario @${is_user.jid.split('@')[0]} está ausente.\n\n> *Detalles:*\n◦  *Razón :* ${reason ? reason : '×'}\n◦  *Duración :* ${Utils.toTime(new Date - afkTime)} aprox.`, m).then(async () => {
                  client.reply(jid, `${setting.emoji}  Alguien del grupo [ *${await (await client.groupMetadata(m.chat)).subject}* ] te menciono en este momento.\n\n◦  *Usuario :* @${m.sender.split('@')[0]}`, m).then(async () => {
                     await client.copyNForward(jid, m)
                  })
               })
            }
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   group: true
}
