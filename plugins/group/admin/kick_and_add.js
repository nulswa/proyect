export const run = {
   usage: ['add', 'promote', 'demote', 'kick'],
   use: 'mention',
   category: 'admin group',
   async: async (m, { client, text, command, Utils, setting }) => {
      try {
         const args = (m?.mentionedJid?.[0] || m?.quoted?.sender || text)?.trim()
         if (!args) return client.reply(m.chat, `${setting.emoji}  Mencione o responda a un usuario.`, m)
         let jid = args.endsWith('lid') ? args : null
         if (!jid) {
            const result = await client.onWhatsApp(args)
            if (!result.length) throw new Error('Invalid number.')
            jid = client.decodeJid(result[0].jid)
         }
         const member = await client.getJidFromParticipants(m.chat, jid)
         if (['kick', 'promote', 'demote'].includes(command)) {
            if (!member) return client.reply(m.chat, `${setting.emoji}  El usuario ha salido del grupo o no existe.`, m)
            const [json] = await client.groupParticipantsUpdate(m.chat, [member.id], command === 'kick' ? 'remove' : command)
            if (json.status === '200') return client.reply(m.chat, `${setting.emoji2}  ${setting.sucs} :)`, m)
            throw new Error('Action failed')
         } else if (command === 'add') {
            if (member) return client.reply(m.chat, `${setting.emoji}  El usuario @${member.id?.replace(/@.+/, '')} ya existe en este grupo.`, m)
            const [json] = await client.groupParticipantsUpdate(m.chat, [jid], command)
            if (json.status === '200') return client.reply(m.chat, `${setting.emoji2}  ${setting.sucs} :)`, m)
            throw new Error('Action failed')
         }
      } catch (e) {
         client.reply(m.chat, e.message, m)
      }
   },
   group: true,
   admin: true,
   botAdmin: true
}