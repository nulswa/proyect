import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

export const run = [{
   usage: ['checkfix'],
   category: 'owner',
   async: async (m, { client, setting }) => {
      try {
         client.sendReact(m.chat, setting.timeLoad, m.key)

         let { stdout: logOutput } = await execPromise('git log -1 --stat')
         const { stdout: statusOutput } = await execPromise('git status -s')

         logOutput = censorTextEmail(logOutput)

         let message = `${setting.emoji2}  *Ultima Actualización.*\n- Aqui estan los commits registrados.\n\n${logOutput.trim()}`

         if (statusOutput.trim()) {
            message += `\n\n${setting.emoji2}  *Cambios Locales.*\n- Aqui estan los cambios registrados.\n\n${statusOutput.trim()}`
         }

         client.reply(m.chat, message, m)
      } catch (e) {
         const errorMessage = e.stderr || e.stdout || e.message || String(e)
         client.reply(m.chat, `${errorMessage}`, m)
      }
   },
   owner: true
}, {
   usage: ['fixding'],
   category: 'owner',
   async: async (m, { client, setting }) => {
      try {
         client.sendReact(m.chat, setting.timeLoad, m.key)

         await execPromise('git fetch')

         let { stdout: logOutput } = await execPromise('git log HEAD..FETCH_HEAD --stat')

         if (!logOutput || logOutput.trim() === '') {
            return client.reply(m.chat, `${setting.emoji}  No hay actualizaciones pendientes.\n- Se mostrara cuando haya algo pendiente.`, m)
         }

         logOutput = censorTextEmail(logOutput)

         const message = `${setting.emoji}  *Actualización Pendiente.*\n- Aqui estan los commits pendientes.\n\n${logOutput.trim()}`

         client.reply(m.chat, message, m)
      } catch (e) {
         const errorMessage = e.stderr || e.stdout || e.message || String(e)
         client.reply(m.chat, `${errorMessage}`, m)
      }
   },
   owner: true
}]

function censorTextEmail(text) {
   return text.replace(/\b([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, (match, local, domain) => {
      let cLocal = local.length <= 2 ? `${local[0]}***` : `${local.slice(0, 2)}***${local.slice(-1)}`

      let dIndex = domain.indexOf('.')
      let dName = domain.slice(0, dIndex)
      let dExt = domain.slice(dIndex)

      let cDomain = dName.length <= 2 ? `${dName[0]}***` : `${dName.slice(0, 1)}***${dName.slice(-1)}`

      return `${cLocal}@${cDomain}${dExt}`
   })
}