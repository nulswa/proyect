import { format } from 'date-fns'

export const run = {
   usage: ['hitstat'],
   category: 'information',
   async: async (m, { client, isPrefix, command, setting, Utils }) => {
      const types = command == 'hitstat' ? global.db.statistic : Object.fromEntries(Object.entries(global.db.statistic).filter(([_, prop]) => moment(prop.lasthit).format('DDMMYY') == moment(new Date).format('DDMMYY')))
      let stat = Object.keys(types)
      if (stat.length == 0) return client.reply(true, `${setting.emoji}  *No hay comandos en uso.*`, m)
      class Hit extends Array {
         total(key) {
            return this.reduce((a, b) => a + (b[key] || 0), 0)
         }
      }
      let sum = new Hit(...Object.values(types))
      let sorted = command == 'hitstat' ? Object.entries(types).sort((a, b) => b[1].hitstat - a[1].hitstat) : Object.entries(types).sort((a, b) => b[1].today - a[1].today)
      let prepare = sorted.map(v => v[0])
      let show = Math.min(10, prepare.length)
      let teks = `\t\t· ─ ⊹ *Hitstat* ⊹ ─ ·\n\n`
      teks += `- *Cantidad de comandos en uso ${command == 'hitstat' ? 'actualmente' : 'en este dia'} son :* ${Utils.formatNumber(command == 'hitstat' ? sum.total('hitstat') : sum.total('today'))} usos.` + '\n\n'
      teks += sorted.slice(0, show).map(([cmd, prop], i) => '• » *Comando :*  ' + Utils.texted('monospace', isPrefix + cmd) + '\n»  *Usos:* '  + Utils.formatNumber(command == 'hitstat' ? prop.hitstat : prop.today) + 'x\n• » *Último uso :* ' + format(prop.lasthit, 'dd/MM/yy HH:mm:ss')).join`\n\n\n`
      teks += `\n\n${setting.botDesc}`
      client.reply(m.chat, teks, m)
   },
   error: false
}