export const run = {
   usage: ['mute'],
   use: 'reply',
   category: 'admin group',
   async: async (m, { client, args, Utils, setting }) => {
      let gc = global.db.groups.find(v => v.jid == m.chat)
      let opt = [0, 1]
      if (!args || !args[0] || !opt.includes(parseInt(args[0]))) return client.reply(m.chat, `~ *Estado actual :* ${gc.mute ? 'Activado' : 'Desactivado'}.`, m)
      if (parseInt(args[0]) == 1) {
         if (gc.mute) return client.reply(m.chat, `${setting.emoji}  El usuario ya esta muteado.`, m)
         gc.mute = true
         client.reply(m.chat, `${setting.emoji2}  ${setting.sucs} :)`, m)
      } else if (parseInt(args[0]) == 0) {
         if (!gc.mute) return client.reply(m.chat, `${setting.emoji}  El usuario no esta muteado.`, m)
         gc.mute = false
         client.reply(m.chat, `${setting.emoji2}  ${setting.sucs} :)`, m)
      }
   },
   admin: true,
   group: true
}