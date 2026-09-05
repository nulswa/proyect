import fsPromise from 'fs/promises'
import { models } from '../../core/models.js'

export const run = {
   usage: ['restore'],
   category: 'owner',
   async: async (m, { client, Config, system, setting, Utils }) => {
      try {
         if (m.quoted && /document/.test(m.quoted.mtype) && /json/.test(m.quoted.fileName)) {
            await client.sendReact(m.chat, setting.timeLoad, m.key)
            const fn = await Utils.getFile(await m.quoted.download())
            if (!fn.status) return client.reply(m.chat, `${setting.emoji}  El archivo no se pudo descargar.`, m)
            const data = await fsPromise.readFile(fn.file, 'utf-8')
            await system.proxy.restore(models.structure, data, Config.database)
            client.reply(m.chat, `${setting.emoji2}  La base de datos se restableció correctamente.  :)`, m)
         } else client.reply(m.chat, `${setting.emoji}  Responda al archivo y use este comando.`, m)
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true
}
