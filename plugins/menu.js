import { Version } from '@neoxr/wb'
import fs from 'node:fs'

function buildCategoriesBlock(plugins, setting, isPrefix, isOwner, isPremium) {
   let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
   let cmd = Object.fromEntries(filter)
   let category = []
   for (let name in cmd) {
      let obj = cmd[name].run
      if (!cmd) continue
      if (!obj.category || setting.hidden.includes(obj.category)) continue
               if (obj.category.toLowerCase() === 'owner' && !isOwner) continue
      if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
      else {
         category[obj.category] = []
         category[obj.category].push(obj)
      }
   }
   const keys = Object.keys(category).sort()
   let print = ''
   for (let k of keys) {
      print += '\n\n㋧  *' + k.toUpperCase().split('').map(v => v).join(' ') + '*\n'
      let cmd2 = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == k.toLowerCase())
      let commands = []
      cmd2.map(([_, v]) => {
         if (v.run.premium && !isPremium) return
         switch (v.run.usage.constructor.name) {
            case 'Array':
               v.run.usage.map(x => commands.push({ usage: x, use: v.run.use ? `[${v.run.use}]` : '' }))
               break
            case 'String':
               commands.push({ usage: v.run.usage, use: v.run.use ? `[${v.run.use}]` : '' })
         }
      })
      print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map(v => `	● ${isPrefix + v.usage}  ${v.use}`).join('\n')
   }
   return print
}

async function sendFullMenu(client, m, { setting, isPrefix, plugins, Utils, isOwner, isPremium }) {
   const library = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

   let header = `${setting.emoji2}  Este es el menu completo, ante cualquier error, puede usar *${isPrefix}support* y reportar el error.\n\n`
   header += `◦  *Client :* ${setting.cliBot}\n`
   header += `◦  *Toolkit :* ${setting.toolks}\n`
   header += `◦  *DB :* ${setting.dataBot}\n`
   header += `◦  *Versión Org. :* ${library.version}\n`
   header += `◦  *Uptime :* ${Utils.toTime(process.uptime() * 1000)}\n`
   header += `◦  *Librerías :* ${Object.keys(library.dependencies || {}).length}`

   const body = buildCategoriesBlock(plugins, setting, isPrefix, isOwner, isPremium)

   return client.sendMessageModify(m.chat, header + body + '\n\n' + setting.botDesc, m, {
      largeThumb: true,
      type: 'preview-link',
      ratio: 'landscape',
      thumbnail: Utils.isUrl(setting.waMenu) ? setting.waMenu : Buffer.from(setting.waMenu, 'base64'),
      url: setting.link,
      icon: setting.icon ? (Utils.isUrl(setting.icon) ? setting.icon : Buffer.from(setting.icon, 'base64')) : null
   })
}

export const run = {
   usage: ['menu', 'help', 'command'],
   async: async (m, { client, text, isPrefix, command, setting, system, plugins, Config, Utils, isOwner, users }) => {
      try {
         const isPremium = !!(users && users.premium)
         const local_size = fs.existsSync('./' + Config.database + '.json') ? await Utils.formatSize(fs.statSync('./' + Config.database + '.json').size) : ''
         const library = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
         const message = setting.msg
            .replace('+tag', `@${m.sender.replace(/@.+/g, '')}`)
            .replace('+name', m.pushName).replace('+greeting', Utils.greeting())
            .replace('+db', (system.name === 'Local' ? `Local (${local_size})` : system.name))
            .replace('+module', Version).replace('^', '').replace('~', '')
            .replace('+version', (library.dependencies.bails ? library.dependencies.bails : library.dependencies['baileys'] ? library.dependencies['baileys'] : library.dependencies.baileys).replace('^', '').replace('~', ''))
            + `\n\n◦  *Client :* ${setting.cliBot}\n◦  *Toolkit :* ${setting.toolks}\n◦  *DB :* ${setting.dataBot}\n◦  *Versión Org. :* ${library.version}\n◦  *Uptime :* ${Utils.toTime(process.uptime() * 1000)}\n◦  *Librerías :* ${Object.keys(library.dependencies || {}).length}`

         const style = setting.style
         if (style === 1) {
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
            let cmd = Object.fromEntries(filter)
            let category = []
            for (let name in cmd) {
               let obj = cmd[name].run
               if (!cmd) continue
               if (!obj.category || setting.hidden.includes(obj.category)) continue
               if (obj.category.toLowerCase() === 'owner' && !isOwner) continue
               if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
               else {
                  category[obj.category] = []
                  category[obj.category].push(obj)
               }
            }
            const keys = Object.keys(category).sort()
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001)
            for (let k of keys) {
               print += '\n\n㋧  *' + k.toUpperCase().split('').map(v => v).join(' ') + '*\n'
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == k.toLowerCase())
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  if (v.run.premium && !isPremium) return
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? `[${v.run.use}]` : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? `[${v.run.use}]` : ''
                        })
                  }
               })
               print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map(v => `	● ${isPrefix + v.usage}  ${v.use}`).join('\n')
            }
            client.sendMessageModify(m.chat, print + '\n\n' + global.footer, m, {
               ads: false,
               largeThumb: true,
               type: 'preview-link',
               ratio: 'landscape',
               thumbnail: Utils.isUrl(setting.waMenu) ? setting.waMenu : Buffer.from(setting.waMenu, 'base64'),
               url: setting.link,
               icon: setting.icon ? Utils.isUrl(setting.icon) ? setting.icon : Buffer.from(setting.icon, 'base64') : null
            })
         } else if (style === 2) {
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
            let cmd = Object.fromEntries(filter)
            let category = []
            for (let name in cmd) {
               let obj = cmd[name].run
               if (!cmd) continue
               if (!obj.category || setting.hidden.includes(obj.category)) continue
               if (obj.category.toLowerCase() === 'owner' && !isOwner) continue
               if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
               else {
                  category[obj.category] = []
                  category[obj.category].push(obj)
               }
            }
            const keys = Object.keys(category).sort()
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001)
            for (let k of keys) {
               print += '\n\n╭─·› *' + k.toUpperCase().split('').map(v => v).join(' ') + '*\n'
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == k.toLowerCase())
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  if (v.run.premium && !isPremium) return
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? `<${v.run.use}>` : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? `<${v.run.use}>` : ''
                        })
                  }
               })
               print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `│◦ *${isPrefix + v.usage}*  ${v.use}`
                  } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                     return `╰·◦ *${isPrefix + v.usage}*  ${v.use}`
                  } else {
                     return `│◦ *${isPrefix + v.usage}*  ${v.use}`
                  }
               }).join('\n')
            }
            client.sendMessageModify(m.chat, print + '\n\n' + global.footer, m, {
               largeThumb: true,
               type: 'preview-link',
               ratio: 'landscape',
               thumbnail: Utils.isUrl(setting.waMenu) ? setting.waMenu : Buffer.from(setting.waMenu, 'base64'),
               url: setting.link,
               icon: setting.icon ? Utils.isUrl(setting.icon) ? setting.icon : Buffer.from(setting.icon, 'base64') : null
            })
         } else if (style === 3) {
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
            let cmd = Object.fromEntries(filter)
            let category = []
            for (let name in cmd) {
               let obj = cmd[name].run
               if (!cmd) continue
               if (!obj.category || setting.hidden.includes(obj.category)) continue
               if (obj.category.toLowerCase() === 'owner' && !isOwner) continue
               if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
               else {
                  category[obj.category] = []
                  category[obj.category].push(obj)
               }
            }
            const keys = Object.keys(category).sort()
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001)
            for (let k of keys) {
               print += '\n\n•⟢ *' + k.toUpperCase().split('').map(v => v).join(' ') + '* ⟣•\n'
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == k.toLowerCase())
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  if (v.run.premium && !isPremium) return
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? `«${v.run.use}»` : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? `«${v.run.use}»` : ''
                        })
                  }
               })
               print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `⋆✎ ${isPrefix + v.usage}  ${v.use}`
                  } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                     return `⋆✎ ${isPrefix + v.usage}  ${v.use}`
                  } else {
                     return `⋆✎ ${isPrefix + v.usage}  ${v.use}`
                  }
               }).join('\n')
            }
            client.sendMessageModify(m.chat, print + '\n\n' + global.footer, m, {
               largeThumb: true,
               type: 'preview-link',
               ratio: 'landscape',
               thumbnail: Utils.isUrl(setting.waMenu) ? setting.waMenu : Buffer.from(setting.waMenu, 'base64'),
               url: setting.link,
               icon: setting.icon ? Utils.isUrl(setting.icon) ? setting.icon : Buffer.from(setting.icon, 'base64') : null
            })
         } else if (style === 4) {
            if (text && text.trim().toLowerCase() === 'all') {
               return await sendFullMenu(client, m, { setting, isPrefix, plugins, Utils, isOwner, isPremium })
            }
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == text.trim().toLowerCase() && !setting.hidden.includes(v.run.category.toLowerCase()))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  if (v.run.premium && !isPremium) return
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? v.run.use : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? v.run.use : ''
                        })
                  }
               })
               let print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `⊸⊹ *${isPrefix + v.usage}* › ${v.use}`
                  } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                     return `⊸⊹ *${isPrefix + v.usage}* › ${v.use}`
                  } else {
                     return `⊸⊹ *${isPrefix + v.usage}* › ${v.use}`
                  }
               }).join('\n')
               m.reply(print)
            } else {
               let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
               let cmd = Object.fromEntries(filter)
               let category = []
               for (let name in cmd) {
                  let obj = cmd[name].run
                  if (!cmd) continue
                  if (!obj.category || setting.hidden.includes(obj.category)) continue
               if (obj.category.toLowerCase() === 'owner' && !isOwner) continue
                  if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
                  else {
                     category[obj.category] = []
                     category[obj.category].push(obj)
                  }
               }
               const keys = Object.keys(category).sort()

               const buttons = [{
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                     display_text: 'Runtime',
                     id: `${isPrefix}run`,
                     icon: 'REVIEW'
                  }),
               }, {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                     title: 'Click',
                     sections: [{
                        rows: [{
                           title: 'Menu completo',
                           description: 'Muestra todas las categorías y comandos disponibles',
                           id: `${isPrefix + command} all`
                        }]
                     }, {
                        rows: keys.map(v => ({
                           title: Utils.ucword(v),
                           description: `Con ${Utils.arrayJoin(Object.entries(plugins).filter(([_, x]) => x.run.usage && x.run.category == v.trim().toLowerCase() && !setting.hidden.includes(x.run.category.toLowerCase()) && (!x.run.premium || isPremium)).map(([_, x]) => x.run.usage)).length} comandos disponibles`,
                           id: `${isPrefix + command} ${v}`
                        }))
                     }],
                     icon: 'DEFAULT'
                  })
               }]
               client.sendIAMessage(m.chat, buttons, m, {
                  header: global.header,
                  content: message,
                  v2: true,
                  footer: global.footer,
                  media: Utils.isUrl(setting.waMenu) ? setting.waMenu : Buffer.from(setting.waMenu, 'base64'),
               })
            }
         } else if (style === 5) {
            if (text && text.trim().toLowerCase() === 'all') {
               return await sendFullMenu(client, m, { setting, isPrefix, plugins, Utils, isOwner, isPremium })
            }
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == text.trim().toLowerCase() && !setting.hidden.includes(v.run.category.toLowerCase()))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  if (v.run.premium && !isPremium) return
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? `«${v.run.use}»` : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? `«${v.run.use}»` : ''
                        })
                  }
               })
               let print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `❒ ${isPrefix + v.usage}  ${v.use}`
                  } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                     return `❒ ${isPrefix + v.usage}  ${v.use}`
                  } else {
                     return `❒ ${isPrefix + v.usage}  ${v.use}`
                  }
               }).join('\n')
               m.reply(print)
            } else {
               let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
               let cmd = Object.fromEntries(filter)
               let category = []
               for (let name in cmd) {
                  let obj = cmd[name].run
                  if (!cmd) continue
                  if (!obj.category || setting.hidden.includes(obj.category)) continue
               if (obj.category.toLowerCase() === 'owner' && !isOwner) continue
                  if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
                  else {
                     category[obj.category] = []
                     category[obj.category].push(obj)
                  }
               }
               const keys = Object.keys(category).sort()

               client.replyButton(m.chat, [{
                  text: '☰ List',
                  command: '-',
                  name: 'single_select',
                  params: {
                     title: 'Toca para ver',
                     sections: [{
                        rows: [{
                           title: 'Menu completo',
                           description: 'Muestra todas las categorías y comandos disponibles',
                           id: `${isPrefix + command} all`
                        }]
                     }, {
                        rows: keys.map(v => ({
                           title: Utils.ucword(v),
                           description: `Con ${Utils.arrayJoin(Object.entries(plugins).filter(([_, x]) => x.run.usage && x.run.category == v.trim().toLowerCase() && !setting.hidden.includes(x.run.category.toLowerCase()) && (!x.run.premium || isPremium)).map(([_, x]) => x.run.usage)).length} comandos disponibles`,
                           id: `${isPrefix + command} ${v}`
                        }))
                     }],
                     icon: 'DEFAULT'
                  }
               }, {
                  text: 'Runtime',
                  command: `${isPrefix}runtime`
               }], m, {
                  text: message,
                  footer: global.footer,
                  location: {
                     name: setting.botName,
                     description: setting.botDesc
                  },
                  media: Utils.isUrl(setting.waMenu) ? setting.waMenu : Buffer.from(setting.waMenu, 'base64')
               })
            }
         } else if (style === 6) {
            if (text && text.trim().toLowerCase() === 'all') {
               return await sendFullMenu(client, m, { setting, isPrefix, plugins, Utils, isOwner, isPremium })
            }
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == text.trim().toLowerCase() && !setting.hidden.includes(v.run.category.toLowerCase()))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  if (v.run.premium && !isPremium) return
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? `«${v.run.use}»` : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? `«${v.run.use}»` : ''
                        })
                  }
               })
               let print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `● *${isPrefix + v.usage}*  ${v.use}`
                  } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                     return `● *${isPrefix + v.usage}*  ${v.use}`
                  } else {
                     return `● *${isPrefix + v.usage}*  ${v.use}`
                  }
               }).join('\n')
               m.reply(print)
            } else {
               let print = message
               // print += '\n' + String.fromCharCode(8206).repeat(4001) + '\n'
               let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
               let cmd = Object.fromEntries(filter)
               let category = []
               for (let name in cmd) {
                  let obj = cmd[name].run
                  if (!cmd) continue
                  if (!obj.category || setting.hidden.includes(obj.category)) continue
               if (obj.category.toLowerCase() === 'owner' && !isOwner) continue
                  if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
                  else {
                     category[obj.category] = []
                     category[obj.category].push(obj)
                  }
               }
               const keys = Object.keys(category).sort()
               let sections = [{
                  rows: [{
                     title: 'Menú completo',
                     description: 'Muestra todas las categorías y comandos disponibles',
                     id: `${isPrefix + command} all`
                  }]
               }]
               const label = {
                  highlight_label: 'Mas usado'
               }
               keys.sort((a, b) => a.localeCompare(b)).map((v, i) => sections.push({
                  ...(/download|conver|util/.test(v) ? label : {}),
                  rows: [{
                     title: Utils.ucword(v),
                     description: `Con ${Utils.arrayJoin(Object.entries(plugins).filter(([_, x]) => x.run.usage && x.run.category == v.trim().toLowerCase() && !setting.hidden.includes(x.run.category.toLowerCase()) && (!x.run.premium || isPremium)).map(([_, x]) => x.run.usage)).length} comandos disponibles`,
                     id: `${isPrefix + command} ${v}`
                  }]
               }))
               const buttons = [{
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                     display_text: "Server",
                     id: `${isPrefix}server`
                  }),
               }, {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                     display_text: setting.nameMark,
                     url: `${setting.web}`,
                     merchant_url: `${setting.web}`
                  })
               }, {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                     title: 'Next Page',
                     sections
                  })
               }]
               client.sendIAMessage(m.chat, buttons, m, {
                  header: setting.botName,
                  content: print,
                  v2: true,
                  footer: setting.botDesc,
                  media: Utils.isUrl(setting.waMenu) ? setting.waMenu : Buffer.from(setting.waMenu, 'base64'),
                  multiple: {
                     name: 'ネ Farguts 〤',
                     code: `${setting.nameMark}`,
                     list_title: 'Select Menu',
                     button_title: 'Click'
                  }
               })
            }
         }
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}