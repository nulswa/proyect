export const run = {
   usage: ['asupan'],
   use: 'username',
   category: 'download',
   async: async (m, { client, setting, args, Utils }) => {
      try {
         client.sendReact(m.chat, setting.timeLoad, m.key)
         const json = await Api.neoxr('/asupan', {
            username: args[0] || Utils.random([ 'hosico_cat', 'dibdiby', 'bulansutena', 'sesaaak', 'ordinary307girl' ])
         })
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
let caption = `${Utils.lineBase('Asupan')}

> ${json.data.caption || '×'}

◦  *Creador :* ${json.data.author.nickname} (@${json.data.author.uniqueId})
◦  *Vistas :* ${Utils.h2k(json.data.statistic.views)} 
◦  *Likes :* ${Utils.h2k(json.data.statistic.likes)}
◦  *Compartidos :* ${Utils.h2k(json.data.statistic.shares)}
◦  *Comentarios :* ${Utils.h2k(json.data.statistic.comments)}
◦  *Sonido :* ${json.data.music.title} - ${json.data.music.author}

${setting.botDesc}`
         client.sendFile(m.chat, json.data.video.url, 'video.mp4', caption, m)
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true
}
