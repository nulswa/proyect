import { models } from '../../core/models.js'

export const run = {
   usage: ['fixdb'],
   category: 'owner',
   async: async (m, {
      Utils, client
   }) => {
      try {
         const isObject = (item) => (item && typeof item === 'object' && !Array.isArray(item))

         const validate = (target, source) => {
            if (!target || !source) return
            for (const key in source) {
               if (isObject(source[key])) {
                  if (!target[key] || !isObject(target[key])) {
                     target[key] = JSON.parse(JSON.stringify(source[key]))
                  } else {
                     validate(target[key], source[key])
                  }
               } else {
                  if (typeof target[key] === 'undefined' || target[key] === null) {
                     target[key] = source[key]
                  }
               }
            }
         }

         if (Array.isArray(global.db.users)) global.db.users.forEach(u => validate(u, models.users))
         if (Array.isArray(global.db.players)) global.db.players.forEach(p => validate(p, models.players))
         if (Array.isArray(global.db.groups)) global.db.groups.forEach(g => validate(g, models.groups))
         if (Array.isArray(global.db.chats)) global.db.chats.forEach(c => validate(c, models.chats))
         if (global.db.setting) validate(global.db.setting, models.setting)

let pr = `${Utils.lineBase('Fix - DB')}

◦  *Usuarios :* ${global.db.users?.length || 0}
◦  *Grupos :* ${global.db.groups?.length || 0}
◦  *Chats :* ${global.db.chats?.length || 0}`
         client.reply(m.chat, pr, m)
      } catch (e) {
         console.error(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true
}