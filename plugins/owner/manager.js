export const run = {
   usage: ['+owner', '-owner', '-prem', 'block', 'unblock', 'ban', 'unban'],
   use: 'mention',
   category: 'owner',
   async: async (m, { client, text, isPrefix, command, Config, Utils, setting }) => {
      try {
         const input = m?.mentionedJid?.[0] || m?.quoted?.sender || text
         if (!input) return client.reply(m.chat, Utils.example(isPrefix, command, `@${m.sender.split('@')[0]}`), m)
         const p = await client.onWhatsApp(input.trim())
         if (!p.length) return client.reply(m.chat, `${setting.emoji}  El numero proporcionado no es valido.`, m)
         const jid = client.decodeJid(p[0].jid)
         const number = jid.replace(/@.+/, '')
         if (command == '+owner') { // add owner number
            let owners = global.db.setting.owners
            if (owners.includes(number)) return client.reply(m.chat, `${setting.emoji}  El usuario ya es *owner* en el bot.`, m)
            owners.push(number)
            client.reply(m.chat, `${setting.emoji2}  El usuario @${number} fue agregado como *owner* en el bot.`, m)
         } else if (command == '-owner') { // remove owner number
            let owners = global.db.setting.owners
            if (!owners.includes(number)) return client.reply(m.chat, `${setting.emoji}  El usuario no es *owner* en el bot.`, m)
            owners.forEach((data, index) => {
               if (data === number) owners.splice(index, 1)
            })
            client.reply(m.chat, `${setting.emoji2}  El usuario @${number} fue quitado como *owner* en el bot.`, m)
         } else if (command == '-prem') { // remove premium
            let data = global.db.users.find(v => v.jid == jid)
            if (typeof data == 'undefined') return client.reply(m.chat, `${setting.emoji}  El usuario no esta en la base de datos.`, m)
            if (!data.premium) return client.reply(m.chat, `${setting.emoji}  El usuario no tiene un plan *premium*.`, m)
            data.limit = Config.limit
            data.premium = false
            data.expired = 0
            client.reply(m.chat, `${setting.emoji}  El usuario @${jid.replace(/@.+/, '')} fue removido como *Premium*.\n- Ahora limitaciones en el bot.`, m)
         } else if (command == 'block') { // block user
            if (jid == client.decodeJid(client.user.id)) return client.reply(m.chat, `:/`, m)
            client.updateBlockStatus(jid, 'block').then(res => m.reply(Utils.jsonFormat(res)))
         } else if (command == 'unblock') { // unblock user
            client.updateBlockStatus(jid, 'unblock').then(res => m.reply(Utils.jsonFormat(res)))
         } else if (command == 'ban+') { // banned user
            let is_user = global.db.users
            let is_owner = [client.decodeJid(client.user.id).split`@`[0], Config.owner, ...global.db.setting.owners].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(jid)
            if (!is_user.some(v => v.jid == jid)) return client.reply(m.chat, `${setting.emoji}  El usuario no esta en la base de datos.`, m)
            if (is_owner) return client.reply(m.chat, `${setting.emoji}  No puedes banear el numero del propietario.`, m)
            if (jid == client.decodeJid(client.user.id)) return client.reply(m.chat, `:/`, m)
            if (is_user.find(v => v.jid == jid).banned) return client.reply(m.chat, `${setting.emoji}  El usuario ya esta baneado.`, m)
            is_user.find(v => v.jid == jid).banned = true
            let banned = is_user.filter(v => v.banned).length
            client.reply(m.chat, `${setting.emoji2}  El usuario @${jid.split`@`[0]} fue baneado.\n- *Bannedl : ${banned}*`, m)
         } else if (command == 'ban-') { // unbanned user
            let is_user = global.db.users
            if (!is_user.some(v => v.jid == jid)) return client.reply(m.chat, `${setting.emoji}  El usuario no esta en la base de datos.`, m)
            if (!is_user.find(v => v.jid == jid).banned) return client.reply(m.chat, `${setting.emoji}  El usuario no esta baneado.`, m)
            is_user.find(v => v.jid == jid).banned = false
            let banned = is_user.filter(v => v.banned).length
            client.reply(m.chat, `${setting.emoji2}  El usuario @${jid.split`@`[0]} fue desbaneado correctamente.\n- *Banned : ${banned}*`, m)
         }
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   owner: true
}
