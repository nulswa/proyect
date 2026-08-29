import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)
export const run = {
   usage: ['fix'],
   hidden: ['update'],
   category: 'owner',
   async: async (m, { client, Utils, setting }) => {
      try {
         client.sendReact(m.chat, setting.timeLoad, m.key)

         const { stdout } = await execPromise('git pull')

         if (stdout.includes('Already up to date')) {
            return client.reply(m.chat, `${stdout.trim()}`, m)
         }

         client.reply(m.chat, `${stdout.trim()}`, m)
      } catch (e) {
         const errorMessage = e.stderr || e.stdout || e.message || String(e)

         if (errorMessage.includes('stash') || errorMessage.includes('Please commit your changes')) {
            try {
               const { stdout: stashOutput } = await execPromise('git stash && git pull')

               client.reply(m.chat, `${setting.emoji2}  *Force update.* :)\n\n${stashOutput.trim()}`, m)
            } catch (stashErr) {
               const stashErrorMsg = stashErr.stderr || stashErr.message
               return client.reply(m.chat, `${setting.emoji}  Failed during stash & pull:\n\n${stashErrorMsg}`, m)
            }
         } else {
            return client.reply(m.chat, `${setting.emoji}  Failed to update:\n\n${errorMessage}`, m)
         }
      }
   },
   owner: true
}