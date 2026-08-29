export const run = {
   usage: ['toxic+', 'toxic-'],
   use: 'word',
   category: 'owner',
   async: async (m, { client, args, isPrefix, command, Utils, setting }) => {
      try {
         if (command == 'toxic+') {
            if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'bitch'), m)
            if (global.db.setting.toxic.includes(args[0])) return client.reply(m.chat, `${setting.emoji}  El argumento *[ ${args[0]} ]* ya existe en la database.`, m)
            global.db.setting.toxic.push(args[0])
            global.db.setting.toxic.sort(function(a, b) {
               if (a < b) {
                  return -1;
               }
               if (a > b) {
                  return 1;
               }
               return 0
            })
            client.reply(m.chat, `${setting.emoji2}  El argumento *[ ${args[0]} ]* fue agregado correctamente.`, m)
         } else if (command == 'toxic-') {
            if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'bitch'), m)
            if (global.db.setting.toxic.length < 2) return client.reply(m.chat, `${setting.emoji}  Eso no es un argumento válido.`, m)
            if (!global.db.setting.toxic.includes(args[0])) return client.reply(m.chat, `${setting.emoji}  El argumento *[ ${args[0]} ]* no está en la database`, m)
            global.db.setting.toxic.forEach((data, index) => {
               if (data === args[0]) global.db.setting.toxic.splice(index, 1)
            })
            client.reply(m.chat, `${setting.emoji2}  El argumento *[ ${args[0]} ]* fue eliminado correctamente.`, m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   owner: true
}