export const run = {
   usage: ['restart'],
   category: 'owner',
   async: async (m, { client, system, Utils, setting }) => {
    await client.reply(m.chat, `${setting.emoji2}  Reiniciando...`, m).then(async () => {
         await system.database.save(global.db)
         process.send('reset')
      })
   },
   owner: true
}