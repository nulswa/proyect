import { format } from 'date-fns'

export const run = {
   usage: ['cmdlist'],
   category: 'owner',
   async: async (m, { setting, client, Utils }) => {
      let cmdS = Object.keys(global.db.sticker)
      if (cmdS.length == 0) return client.reply(m.chat, `${setting.emoji}  No hay stickers asignados a comandos...`, m)
      let teks = `${Utils.lineBase('CMD - List')}\n\n`
      for (let i = 0; i < cmdS.length; i++) {
         teks += Utils.texted('bold', (i + 1) + '.') + ' ' + cmdS[i] + '\n'
         teks += '◦  *Asignado :* ' + global.db.sticker[cmdS[i]].text + '\n'
         teks += '◦  *Creado en :* ' + format(global.db.sticker[cmdS[i]].created, 'dd/MM/yy HH:mm:ss') + '\n\n'
      }
      client.reply(m.chat, teks + setting.botDesc, m)
   },
   owner: true
}