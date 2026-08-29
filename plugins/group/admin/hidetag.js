export const run = {
   usage: ['tage'],
   use: 'text',
   category: 'admin group',
   async: async (m, {
      client,
      text,
      participants
   }) => {
      let users = participants.map(u => u.id)
      await client.reply(m.chat, text, null, {
         mentions: users
      })
   },
   admin: true,
   group: true
}