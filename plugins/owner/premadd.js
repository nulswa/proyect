export const run = {
   usage: ['+prem'],
   use: 'mention',
   category: 'owner',
   async: async (m, { client, args, text, isPrefix, command, Utils, setting }) => {
     const parseDuration = (input) => {
         const getUnitName = (unitChar, value) => {
            switch (unitChar) {
               case 'd':
                  return value === 1 ? 'day' : 'days'
               case 'h':
                  return value === 1 ? 'hour' : 'hours'
               case 'm':
                  return value === 1 ? 'minute' : 'minutes'
               case 's':
                  return value === 1 ? 'second' : 'seconds'
               default:
                  return 'days'
            }
         }

         if (!input) {
            return { ms: 86400000 * 30, value: 30, unitName: getUnitName('d', 30) }
         }

         const match = input.match(/^(\d+)([dhms])?$/)
         if (match) {
            const value = parseInt(match[1])
            const unitChar = match[2]

            let ms
            let actualUnitChar

            switch (unitChar) {
               case 'd':
                  ms = value * 86400000
                  actualUnitChar = 'd'
                  break
               case 'h':
                  ms = value * 3600000
                  actualUnitChar = 'h'
                  break
               case 'm':
                  ms = value * 60000
                  actualUnitChar = 'm'
                  break
               case 's':
                  ms = value * 1000
                  actualUnitChar = 's'
                  break
               default:
                  ms = value * 86400000
                  actualUnitChar = 'd'
                  break
            }
            return { ms: ms, value: value, unitName: getUnitName(actualUnitChar, value) }
         } else {
            const num = parseInt(input)
            if (!isNaN(num)) {
               return { ms: num * 86400000, value: num, unitName: getUnitName('d', num) }
            }
         }
         return null
      }

      try {
         let user = global.db.users

         if (m.quoted) {
            if (m.quoted.isBot) return client.reply(m.chat, `${setting.emoji}  *No puedes hacer que el bot sea premium.*`, m)

            const parsedDuration = parseDuration(args[0])
            if (!parsedDuration) {
               return client.reply(m.chat, `${setting.emoji}  Formato de duración no valida.\n\n- *Disponible:*\n• *d* - marcar dias premium\n• *h* - marcar horas premium\n• *m* - marcar minutos premium\n\n${Utils.example(isPrefix, command, `@${m.sender.split('@')[0]} 10d`)}`, m)
            }

            let durationMs = parsedDuration.ms
            let durationValue = parsedDuration.value
            let durationUnitName = parsedDuration.unitName

            let jid = client.decodeJid(m.quoted.sender)
            let users = user.find(v => v.jid == jid)
            users.limit += 1000
            users.limit_game += 1000
            users.expired += users.premium ? durationMs : ((new Date() * 1) + durationMs)

            client.reply(m.chat, users.premium ? `${setting.emoji2}  Se ha añadido *${durationValue} ${durationUnitName}* *Premium* al usuario @${jid.replace(/@.+/, '')} correctamente.` : `${setting.emoji2}  @${jid.replace(/@.+/, '')} ahora es un usuario *Premium* por *${durationValue} ${durationUnitName}*.`, m).then(() => users.premium = true)
         } else if (m.mentionedJid.length != 0) {
            const parsedDuration = parseDuration(args[1])
            if (!parsedDuration) {
               return client.reply(m.chat, `${setting.emoji}  Formato de duración no valida.\n\n- *Disponible:*\n• *d* - marcar dias premium\n• *h* - marcar horas premium\n• *m* - marcar minutos premium\n\n${Utils.example(isPrefix, command, `@${m.sender.split('@')[0]} 10d`)}`, m)
            }

            let durationMs = parsedDuration.ms
            let durationValue = parsedDuration.value
            let durationUnitName = parsedDuration.unitName

            let jid = client.decodeJid(m.mentionedJid[0])
            const users = user.find(v => v.jid == jid)
            users.limit += 1000
            users.expired += users.premium ? durationMs : ((new Date() * 1) + durationMs)

            client.reply(m.chat, users.premium ? `${setting.emoji2}  Se ha añadido *${durationValue} ${durationUnitName}* *Premium* al usuario @${jid.replace(/@.+/, '')} correctamente.` : `${setting.emoji2}  @${jid.replace(/@.+/, '')} ahora es un usuario *Premium* por *${durationValue} ${durationUnitName}*.`, m).then(() => users.premium = true)
         } else if (text && /\|/.test(text)) {
            let [number, durationInput] = text.split`|`
            let p = (await client.onWhatsApp(String(number).startsWith('0') ? '54' + String(number).slice(1) : number.startsWith('+') ? number.match(/\d+/g).join('') : number))[0] || {}
            if (!p.exists) return client.reply(m.chat, 'El numero no esta registrado en WhatsApp.', m)

            const parsedDuration = parseDuration(durationInput)
            if (!parsedDuration) {
               return client.reply(m.chat, `${setting.emoji}  Formato de duración no valida.\n\n- *Disponible:*\n• *d* - marcar dias premium\n• *h* - marcar horas premium\n• *m* - marcar minutos premium\n\n${Utils.example(isPrefix, command, `@${m.sender.split('@')[0]} 10d`)}`, m)
            }

            let durationMs = parsedDuration.ms
            let durationValue = parsedDuration.value
            let durationUnitName = parsedDuration.unitName

            let jid = client.decodeJid(p.jid)
            const users = user.find(v => v.jid == jid)
            if (!users) return client.reply(m.chat, `${setting.emoji}  El usuario no esta en la base de tados.`, m)

            users.limit += 1000
            users.expired += users.premium ? durationMs : ((new Date() * 1) + durationMs)

            client.reply(m.chat, users.premium ? `${setting.emoji2}  Se ha añadido *${durationValue} ${durationUnitName}* *Premium* al usuario @${jid.replace(/@.+/, '')} correctamente.` : `${setting.emoji2}  @${jid.replace(/@.+/, '')} ahora es un usuario *Premium* por *${durationValue} ${durationUnitName}*.`, m).then(() => users.premium = true)

         } else {
            let teks = `${setting.emoji}  Responda o mencione a un usuario.
- Añada un valor de tiempo válido.

- *Disponible:*
• *d* - marcar dias premium 
• *h* - marcar horas premium 
• *m* - marcar minutos premium 

${Utils.example(isPrefix, command, `@${m.sender.split('@')[0]} 10d`)}`
            client.reply(m.chat, teks, m)
         }
      } catch (e) {
         console.error(e)
         client.reply(m.chat, `${setting.emoji}  El usuario no esta en la base de datos o ocurrio un error.`, m)
      }
   },
   error: false,
   owner: true
}