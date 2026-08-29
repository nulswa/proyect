export const run = {
   usage: ['antidelete', 'antilink', 'antivirtex', 'antitagsw', 'autosticker', 'viewonce', 'left', 'filter', 'localonly', 'welcome'],
   use: 'on / off',
   category: 'admin group',
   async: async (m, {
      client,
      args,
      setting,
      isPrefix,
      command,
      isBotAdmin,
      Utils
   }) => {
      try {
         let setting = global.db.groups.find(v => v.jid == m.chat)
         let type = command.toLowerCase()
         if (!isBotAdmin && /antilink|antivirtex|filter|localonly|antitagsw/.test(type)) return client.reply(m.chat, global.status.botAdmin, m)
         if (!args || !args[0]) return client.reply(m.chat, `~ *Estado actual :* ${setting[type] ? 'Activado' : 'Desactivado'}.`, m)
         let option = args[0].toLowerCase()
         let optionList = ['on', 'off']
         if (!optionList.includes(option)) return client.reply(m.chat, `~ *Estado actual :* ${setting[type] ? 'Activado' : 'Desactivado'}.`, m)
         let status = option != 'on' ? false : true
         if (setting[type] == status) return client.reply(m.chat, `${setting.emoji2}  *${option == 'on' ? 'Activated' : 'Inactivated'}.* :)`, m)
         setting[type] = status
         client.reply(m.chat, `${setting.emoji2}  *${option == 'on' ? 'Activated' : 'Inactivated'}.* :)`, m)
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   admin: true,
   group: true
}