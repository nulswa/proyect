import { format } from 'date-fns'
import { models } from '../../core/models.js'

export const run = {
   usage: ['groups'],
   category: 'information',
   async: async (m, { client, isPrefix, Utils, setting }) => {
      let group = global.db.groups
      if (!group) group = []

      const participatingGroups = Object.values(await client.groupFetchAllParticipating())

      const groupDetails = participatingGroups.map((_group, i) => {
         const { id, subject, participants } = _group
         let entry = group.find(g => g.jid === id)

         if (entry) {
            const expiryStatus = entry.stay ? 'FOREVER' : (entry.expired == 0 ? 'No expira.' : '' + Utils.timeReverse(entry.expired - new Date() * 1))
            const memberCount = participants.length
            const muteStatus = entry.mute ? 'Desactivado' : 'Activo'
            const lastActivity = format(Date.now(), 'dd/MM/yy HH:mm:ss')

            return (
               `> *${i + 1}.* ${subject}\n` +
               `❒ *ID :* ${id.split('@')[0]}\n` +
               `❒ Expired : ${expiryStatus} | Members : ${memberCount} | Mute : ${muteStatus} | Run : ${lastActivity}`
            )
         } else {
            const newEntry = {
               jid: id,
               ...models.groups
            }
            group.push(newEntry)

            return (
               `> *${i + 1}.* ${subject}\n` +
               `❒ *ID :* ${id.split('@')[0]}\n` +
               `❒ *Grupo agregado a la base de datos.* ${setting.emoji2}`
            )
         }
      }).join('\n\n')

      let caption = `${Utils.lineBase('Group List')}\n\n`
      caption += `${setting.emoji}  El bot esta en *${participatingGroups.length}* grupos actualmente.\n- Puedes usar *${isPrefix}gc* para algunas opciones.\n\n`
      caption += groupDetails
      caption += `\n\n${setting.botDesc}`

      client.reply(m.chat, caption, m)
   },
   error: false
}
