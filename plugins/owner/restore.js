import fsPromise from 'fs/promises'
import { structure } from '../../core/models.js'

export const run = {
   usage: ['restore'],
   category: 'owner',
   async: async (m, { client, Config, system, Utils, setting }) => {
      try {
         if (m.quoted && /document/.test(m.quoted.mtype) && /json/.test(m.quoted.fileName)) {
            await client.sendReact(m.chat, '⏰', m.key)
            const fn = await Utils.getFile(await m.quoted.download())
            if (!fn.status) return client.reply(m.chat, `${setting.emoji}  El archivo no se puede descargar.`, m)
            const data = await fsPromise.readFile(fn.file, 'utf-8')
            await system.proxy.restore(structure, data, Config.database)
            client.reply(m.chat, `${setting.emoji2}  La base de datos se restauro con exito.`, m)
         } else client.reply(m.chat, `${setting.emoji}  Responda al archivo y use este comando.`, m)
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true
}