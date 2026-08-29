const maximo_xd = 10 * 1024 * 1024

export const run = {
   usage: ['support'],
   hidden: ['reporte', 'report'],
   category: 'information',
   async: async (m, { client, text, isPrefix, command, setting, Config, Utils }) => {
      const q = m.quoted ? m.quoted : m
      const mimetype = (q.msg || q).mimetype || ''
      const fileLength = Number((q.msg || q).fileLength || 0)
      const fileName = (q.msg || q).fileName || ''

      let mediaType = null
      if (q.mtype === 'imageMessage' || /^image\//i.test(mimetype)) mediaType = 'image'
      else if (q.mtype === 'videoMessage' || /^video\//i.test(mimetype)) mediaType = 'video'
      else if (q.mtype === 'audioMessage' || /^audio\//i.test(mimetype)) mediaType = 'audio'
      else if (q.mtype === 'documentMessage' || (mimetype && !mediaType)) mediaType = 'document'

      if (!text?.trim() && !mediaType) {
         return client.reply(m.chat, `${setting.emoji2}  Describe el error que encontraste.\n\n${Utils.example(isPrefix, command, 'Fallan los siguientes comandos:\n#twitter me falla al descargar\n#fakex no me crea la imagen\n#mf no se descargan los archivos.')}\n\n${setting.emoji2}  También puedes responder a una imagen, video, audio/nota de voz o documento *(máximo 10MB)*.`, m)
      }

      if (mediaType && !text?.trim() && mediaType !== 'audio') {
         return client.reply(m.chat, `${setting.emoji}  Describe el error junto con el archivo adjunto.`, m)
      }

      if (text && text.trim().length < 8) {
         return client.reply(m.chat, `${setting.emoji}  Mínimo *8* caracteres para el reporte.`, m)
      }
      if (text && text.trim().length > 1000) {
         return client.reply(m.chat, `${setting.emoji}  Máximo *1000* caracteres para el reporte.`, m)
      }

      if (mediaType) {
         if (/vnd\.android\.package-archive/i.test(mimetype) || /\.apk$/i.test(fileName)) {
            return client.reply(m.chat, `${setting.emoji}  No se aceptan archivos *APK* en los reportes.`, m)
         }
         if (fileLength > maximo_xd) {
            return client.reply(m.chat, `${setting.emoji}  El archivo supera el límite de *10MB* para reportes.`, m)
         }
      }
      await client.sendReact(m.chat, setting.timeLoad, m.key)
      let buffer = null
      if (mediaType) {
         buffer = await q.download().catch(() => null)
         if (!buffer) return client.reply(m.chat, `${setting.emoji}  No se pudo descargar el archivo adjunto.`, m)
      }

      const numero = m.sender.replace(/@.+/, '')
      let reporte = `${Utils.lineBase('Report')}\n\n`
      reporte += `◦  *De :* wa.me/${numero}\n`
      reporte += `◦  *Chat :* ${m.isGroup ? 'Grupo' : 'Privado'}\n\n`
      reporte += text ? text.trim() : 'sin texto'

      const owners = Array.isArray(Config.owner) ? Config.owner : [Config.owner]

      for (const owner of owners) {
         const jid = owner.includes('@') ? owner : `${owner}@s.whatsapp.net`
         try {
            if (mediaType === 'image') {
               await client.sendFile(jid, buffer, 'reporte.jpg', reporte, null)
            } else if (mediaType === 'video') {
               await client.sendFile(jid, buffer, 'reporte.mp4', reporte, null)
            } else if (mediaType === 'audio') {
               await client.sendFile(jid, buffer, 'reporte.mp3', '', null)
               if (text?.trim()) await client.reply(jid, reporte, null)
            } else if (mediaType === 'document') {
               await client.sendFile(jid, buffer, fileName || 'reporte', reporte, null, { document: true })
            } else {
               await client.reply(jid, reporte, null)
            }
         } catch (e) {
            console.log('[support] error enviando a owner', owner, e)
         }
      }

      return client.reply(m.chat, `${setting.emoji}  Tu reporte fue enviado correctamente. En breve será revisado.`, m)
   },
   error: false
}
