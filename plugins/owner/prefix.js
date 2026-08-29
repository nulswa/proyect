export const run = {
   usage: ['prefix', 'prefix+', 'prefix-'],
   use: 'query',
   category: 'owner',
   async: async (m, { client, args, isPrefix, command, Utils, Config, setting }) => {
      let system = global.db.setting
      if (command == 'prefix') {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, '#'), m)

         if (Config.evaluate_chars.includes(args[0])) return client.reply(m.chat, `${setting.emoji}  Este tipo de prefijo *[ ${args[0]} ]* es denegado.\n- Puede causar un error.`, m)
         if (args[0] == system.prefix) return client.reply(m.chat, `${setting.emoji2}  El prefijo *[ ${args[0]} ]* ya esta en uso actualmente.`, m)
         system.onlyprefix = args[0]
         client.reply(m.chat, `${setting.emoji2}  Nuevo prefijo principal *[ ${args[0]} ]* establecido correctamente.`, m)
      } else if (command == 'prefix+') {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, '#'), m)

         if (Config.evaluate_chars.includes(args[0])) return client.reply(m.chat, `${setting.emoji}  Este tipo de prefijo *[ ${args[0]} ]* es denegado.\n- Puede causar un error.`, m)
         if (system.prefix.includes(args[0])) return client.reply(m.chat, `${setting.emoji2}  El prefijo *[ ${args[0]} ]* ya esta en uso actualmente.`, m)
         system.prefix.push(args[0])
         client.reply(m.chat, `${setting.emoji2}  Nuevo prefijo *[ ${args[0]} ]* establecido correctamente.`, m)
      } else if (command == 'prefix-') {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, '#'), m)

         if (system.prefix.length < 2) return client.reply(m.chat, `${setting.emoji}  No puedes eliminar mas prefijos.`, m)
         if (!system.prefix.includes(args[0])) return client.reply(m.chat, `${setting.emoji}  El prefijo *[ ${args[0]} ]* no existe en la lista.`, m)
         system.prefix.forEach((data, index) => {
            if (data === args[0]) system.prefix.splice(index, 1)
         })
         client.reply(m.chat, `${setting.emoji}  El prefijo *[ ${args[0]} ]* fue eliminado correctamente.`, m)
      }
   },
   owner: true
}
