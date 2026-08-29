export const run = {
   usage: ['link'],
   hidden: ['enlace'],
   category: 'group',
   async: async (m, { client, setting }) => {
      await client.reply(m.chat, `${setting.emoji2}  https://chat.whatsapp.com/` + (await client.groupInviteCode(m.chat)), m)
   },
   group: true,
   botAdmin: true
}