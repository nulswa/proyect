import fs from 'fs'
import path from 'path'
const pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'))

export const run = {
  usage: ['runtime'],
  hidden: ['run'],
  category: 'information',
  async: async (m, { client, Utils, setting }) => {
    const start = Date.now()
    const _uptime = process.uptime() * 1000
    const uptime = Utils.toTime(_uptime)
    const libCount = Object.keys(pkg.dependencies || {}).length
    const end = Date.now()


let context = `${Utils.lineBase(`${setting.nameMark} Runtime`)}

◦  *Uptime :* ${uptime}
◦  *Version Org:* ${pkg.version}
◦  *DB :* ${setting.dataBot}
◦  *Client :* @whiskeySockets/Baileys
◦  *Toolkit :* ${setting.toolks}

${setting.botDesc}`
    client.sendIAMessage(m.chat, [{ name: 'inapp_signup', buttonParamsJson: JSON.stringify({}) }], m, {
      header: `${setting.emoji2}  ${setting.botName}`,
      content: context
    })
  }
}
