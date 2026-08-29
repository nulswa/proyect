export const run = {
   usage: ['join'],
   use: 'link',
   category: 'owner',
   async: async (m, { client, args, isPrefix, setting, command, Utils }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://chat.whatsapp.com/xxxx'), m)
         let link = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
         let [_, code] = args[0].match(link) || []
         if (!code) return client.reply(m.chat, global.status.invalid, m)
         let id = await client.groupAcceptInvite(code)
         if (!id.endsWith('g.us')) return client.reply(m.chat, `${setting.emoji}  *No pude unirme al grupo.*`, m)
         let member = await (await client.groupMetadata(id)).participants.map(v => v.id)
         return client.reply(m.chat, `${setting.emoji2}  ${setting.sucs} :)`, m)
      } catch {
         return client.reply(m.chat, `${setting.emoji}  *No pude unirme al grupo.*`, m)
      }
   },
   owner: true
}