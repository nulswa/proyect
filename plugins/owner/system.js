export const run = {
   usage: ['autobackup', 'autodownload', 'antispam', 'debug', 'groupmode', 'multiprefix', 'noprefix', 'online', 'self', 'notifier'],
   use: 'option',
   category: 'owner',
   async: async (m, { client, args, isPrefix, command, Utils, setting }) => {
      let system = global.db.setting
      let type = command.toLowerCase()
      if (!args || !args[0]) return client.reply(m.chat, `~ *Estado Actual :* ${system[type] ? 'Activado' : 'Desactivado'}.`, m)
      let option = args[0].toLowerCase()
      let optionList = ['on', 'off']
      if (!optionList.includes(option)) return client.reply(m.chat, `~ *Estado Actual :* ${system[type] ? 'Activado' : 'Desactivado'}.`, m)
      let status = option != 'on' ? false : true
      if (system[type] == status) return client.reply(m.chat, `${setting.emoji2}  *${option == 'on' ? 'Activated' : 'Desactivated'}.* :)`, m)
      system[type] = status
      client.reply(m.chat, `${setting.emoji2}  *${option == 'on' ? 'Activated' : 'Desactivated'}.* :)`, m)
   },
   owner: true
}