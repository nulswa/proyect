export const run = {
  usage: ['listban', 'listprem', 'listblock'],
  category: 'information',
  async: async (m, { client, command, isOwner, setting, blockList, Utils }) => {
    if (command === 'listban') {
      const data = global.db.users.filter(v => v.banned)
      if (data.length < 1) return client.reply(me.chat, `${setting.emoji}  *No hay usuario baneados aún.*`, m)
      let text = `\t\t⿻ \`Lista de baneados\`\n`
      text += data.map((v, i) => {
        if (i == 0) {
          return `◦ @${client.decodeJid(v.jid).replace(/@.+/, '')}`
        } else if (i == data.length - 1) {
          return `◦ @${client.decodeJid(v.jid).replace(/@.+/, '')}`
        } else {
          return `◦ @${client.decodeJid(v.jid).replace(/@.+/, '')}`
        }
      }).join('\n')
      client.reply(m.chat, text + '\n\n> ' + setting.botDesc, m)
    } else if (command === 'listprem') {
      if (!isOwner) return client.reply(m.chat, global.status.owner, m)
      const data = global.db.users.filter(v => v.premium)
      if (data.length < 1) return client.reply(m.chat, `${setting.emoji}  *No hay usuarios premium aún.*`, m)
      let text = `\t\t⿻ \`Usuarios Premium\`\n\n`
      text += data.map((v, i) => '◦ *Usuario :* @' + client.decodeJid(v.jid).replace(/@.+/, '') + '\n◦ *Usos :* ' + Utils.formatNumber(v.hit) + '\n◦ *Expira en :* ' + Utils.timeReverse(v.expired - new Date() * 1)).join`\n\n`
      m.reply(text + '\n\n> ' + setting.botDesc)
    } else if (command === 'listblock') {
      if (blockList.length < 1) return client.reply(m.chat, `${setting.emoji}  *No hay usuarios bloqueados aún.*`, m)
      let text = `\t\t⿻ \`Usuarios bloqueados\`\n\n`
      text += blockList.map((v, i) => {
        if (i == 0) {
          return `◦ @${client.decodeJid(v).replace(/@.+/, '')}`
        } else if (i == data.length - 1) {
          return `◦ @${client.decodeJid(v).replace(/@.+/, '')}`
        } else {
          return `◦ @${client.decodeJid(v).replace(/@.+/, '')}`
        }
      }).join('\n')
      client.reply(m.chat, text + '\n\n' + setting.botDesc, m)
    }
  },
  error: false
}
