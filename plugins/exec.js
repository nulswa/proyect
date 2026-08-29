import { exec } from 'child_process'
import util from 'util'
import syntax from 'syntax-error'

function detectLanguage(cmdText) {
  const match = cmdText.match(/([\w.\-/]+)\.(\w+)\b/)
  const ext = match?.[2]?.toLowerCase()
  const map = { json: 'json', html: 'html', htm: 'html', js: 'javascript', mjs: 'javascript', cjs: 'javascript', jsx: 'javascript' }

  return map[ext] || 'text'
}

export const run = {
   async: async (m, { client, setting, body, ctx, isOwner, Utils, Scraper }) => {
      if (typeof body !== 'string' || !isOwner) return

      const command = body.trim().split(/\s+/)[0]
      let text = body.trim().substring(command.length).trim()

      if (!text && m.quoted) {
         text = m.quoted.text || m.quoted.body || m.quoted.conversation || (typeof m.quoted === 'string' ? m.quoted : '')
         text = text.trim()
      }

      if (!text) return

      if (command === '=>') {
         try {
            const evL = await eval(`(async () => { return ${text} })()`)
            m.reply(util.format(evL))
         } catch (e) {
            const err = syntax(text)
            const errMsg = err ? Utils.texted('monospace', err) + '\n\n' : ''
            m.reply(errMsg + util.format(e))
         }
      } else if (command === '>') {
         try {
            const evL = await eval(`(async () => { ${text} })()`)
            const res = evL === undefined ? 'Success (No output)' : util.format(evL)
            m.reply(res)
         } catch (e) {
            const err = syntax(text)
            const errMsg = err ? Utils.texted('monospace', err) + '\n\n' : ''
            m.reply(errMsg + util.format(e))
         }
      } else if (command === '$') {
         if (client.sendReact) client.sendReact(m.chat, setting.timeLoad, m.key)

         exec(text, (err, stdout, stderr) => {
            let res = ''
            if (err) res += util.format(err) + '\n\n'
            if (stderr) res += stderr.toString() + '\n\n'
            if (stdout) res += stdout.toString()

            res = res.trim() || 'Success (No output)'
            const language = detectLanguage(text)
            client.sendMetaMsg(m.chat, [{ code: { language, code: res } }], m, { title: `$ ${text}`, mentions: [m.sender] })
         })
      }
   },
   error: false
}
