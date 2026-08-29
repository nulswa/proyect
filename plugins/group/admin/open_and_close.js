export const run = {
   usage: ['group'],
   hidden: ['grupo'],
   use: 'open / close',
   category: 'admin group',
   async: async (m, {
      client,
      args,
      setting,
      Utils
   }) => {
      if (!args || !args[0]) return client.reply(m.chat, `${Utils.example(isPrefix, command, 'close or open')}`, m)
      if (args[0] == 'open' || args[0] == 'abrir') {
         await client.groupSettingUpdate(m.chat, 'not_announcement')
         client.reply(m.chat, `${setting.emoji2}  ${setting.sucs} :)`, m)
      } else if (args[0] == 'close' || args[0] == 'cerrar') {
         await client.groupSettingUpdate(m.chat, 'announcement')
         client.reply(m.chat, `${setting.emoji2}  ${setting.sucs} :)`, m)
      }
   },
   group: true,
   admin: true,
   botAdmin: true
}