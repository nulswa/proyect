export const run = {
   usage: ['setvs'],
   use: 'query',
   category: 'owner',
   async: async (m, { client, args, isPrefix, command, setting, Utils }) => {
      try {
const styleVersions = {
1: '6.7.18',
2: '7.0.0-rc10',
3: '7.0.0-rc11',
4: '7.0.0-rc12',
5: '7.0.0-rc13',
6: '7.0.0-rc14'
}

const help = `${setting.emoji2}  Proporciona la versión actual del bot.
- Se cambiaran algunas funciones tras esto.

- *Disponible:*
${Object.entries(styleVersions).map(([n, v]) => `◦ *${n} »* ${v}`).join('\n')}

${Utils.example(isPrefix, command, '7.0.0-rc14')}`

if (!args || !args[0]) return client.reply(m.chat, help, m)
const input = args[0].trim()
let style = null
if (styleVersions[input]) {
style = parseInt(input)
} else {
const found = Object.entries(styleVersions)
.find(([, v]) => v.toLowerCase() === input.toLowerCase())
if (found) style = parseInt(found[0])
}
if (!style) return client.reply(m.chat, `${setting.emoji}  No existe una versión con ese mumero.`, m)
const version = styleVersions[style]
client.reply(m.chat, `${setting.emoji2}  Se ha cambiado la versión a *Baileys ${version}* correctamente. :)`, m)
.then(() => setting.style = style)
} catch (e) {
client.reply(m.chat, Utils.jsonFormat(e), m)
}
},
owner: true
}