import { format } from 'date-fns'

export const run = {
   usage: ['infogp'],
   category: 'group',
   async: async (m, { client, participants, groupSet, setting, Utils }) => {
      try {
         const meta = await (await client.groupMetadata(m.chat))
         const creator = (meta?.owner?.endsWith('lid') ? (meta?.ownerJid ?? meta?.ownerPn) : meta.owner)?.replace(/@.+/, '')
         const admin = client.getAdmin(meta.participants)
         const member = participants.map(u => u.id)
         const picture = await client.profilePicture(m.chat)
let caption = `${Utils.lineBase('Grupo : Info')}

◦  *Nombre :* ${meta.subjet}
◦  *Participantes :* ${member.length}
◦  *Admins :* ${admin.length}
◦  *Principal :* ${creator ? '@' + creator : '-'}
◦  *Creado en :* ${format(meta.creation * 1000, 'dd/MM/yy HH:mm:ss')}
◦  *Muteado :* ${Utils.switcher(groupSet.mute, 'Si', 'No')}
◦  *Quedarse :* ${Utils.switcher(groupSet.stay, 'Si', 'No')}
◦  *Expiración :* ${groupSet.expired == 0 ? '---' : Utils.timeReverse(groupSet.expired - new Date * 1)}

${setting.botDesc}`
client.reply(m.chat, caption, m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   group: true
}