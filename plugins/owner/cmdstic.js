export const run = {
   usage: ['cmd+', 'cmd-'],
   use: 'command',
   category: 'owner',
   async: async (m, { client, text, isPrefix, setting, command, Utils }) => {
      if (command == 'cmd+') {
         if (!m.quoted || !/webp/.test(m.quoted.mimetype)) return client.reply(m.chat, `${setting.emoji2}  Responda a un sticker y asigna un comando existente.\n\n${Utils.example(isPrefix, command, 'menu')}`, m)
         if (!text) return client.reply(m.chat, `${setting.emoji}  Debes asignar un comando existente.\n\n${Utils.example(isPrefix, command, 'menu')}`, m)
         let hash = m.quoted.fileSha256.toString().replace(/,/g, '')
         if (typeof global.db.sticker[hash] != 'undefined') return client.reply(m.chat, `${setting.emoji} El sticker ya está en la database como : *${global.db.sticker[hash].text}*`, m)
         global.db.sticker[hash] = {
            text: text,
            created: new Date() * 1
         }
         client.reply(m.chat, `${setting.emoji2}  Sticker *CMD* guardado correctamente: ${text}`, m)
      } else if (command == 'cmd-') {
         if (!m.quoted || !/webp/.test(m.quoted.mimetype)) return client.reply(m.chat, `${setting.emoji2}  Responda a un sticker que contenga un comando asignado para eliminarlo de la lista.`, m)
         let hash = m.quoted.fileSha256.toString().replace(/,/g, '')
         if (typeof global.db.sticker[hash] == 'undefined') return client.reply(m.chat, `${setting.emoji}  El sticker mencionado no existe en la databade.`, m)
         delete global.db.sticker[hash]
         client.reply(m.chat, `${setting.emoji2}  *Se ha eliminado el sticker asignado a un comando correctamente.* :)`, m)
      }
   },
   owner: true
}