import fetch from 'node-fetch'

const max_download = 100 * 1024 * 1024 
const meta_limit = 10000 
const text_limit = 65000 

const mime_ext = {
   'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
   'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
   'audio/mpeg': 'mp3', 'audio/ogg': 'ogg', 'audio/wav': 'wav', 'audio/mp4': 'm4a',
   'application/pdf': 'pdf', 'application/zip': 'zip'
}

function detectLanguage(type, url) {
   const ext = url.split('.').pop()?.toLowerCase()
   const map = { json: 'json', html: 'html', htm: 'html', js: 'javascript', css: 'css', py: 'python', xml: 'xml' }
   return map[ext] || (type.includes('json') ? 'json' : type.includes('html') ? 'html' : 'text')
}

function dateStamp() {
   return new Date().toLocaleString().replace(/[/:]/g, '-')
}

function getFilename(headers, url, type) {
   const disposition = headers.get('content-disposition')
   if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/)
      if (match) return match[1]
   }

   const nameFromUrl = url.split('/').pop()?.split('?')[0]
   if (nameFromUrl && nameFromUrl.includes('.')) return nameFromUrl

   const ext = mime_ext[type.split(';')[0].trim()] || 'bin'
   return `Download-${dateStamp()}.${ext}`
}

export const run = {
   usage: ['get'],
   hidden: ['fetch'],
   use: 'url',
   category: 'aleatory',
   async: async (m, { client, text, isPrefix, command, Utils, setting }) => {
      try {
         let examText = `${Utils.lineBase('Fetch URL')}
> ${setting.emoji2}  Realiza peticiones *HTTP* para obtener información.

- *Opciones :*
◦  *--less :* devuelve body *(texto)*
◦  *--headers :* devuelve headers
◦  *--status :* devuelve status HTTP
◦  *--cok :* devuelve cookies
◦  *--json :* fuerza salida JSON
◦  *--curl :* permite headers estilo curl

${Utils.example(isPrefix, command, 'https://example.com --headers')}`
         if (!text || !/^https?:\/\//.test(text)) {
            return client.reply(m.chat, examText, m)
         }

         let parts = text.trim().split(' ')
         let url = parts.shift()
         let args = parts
         let headers = {}
         let curl = args.indexOf('--curl')
         if (curl !== -1) {
            let h = args.join(' ')
            let matches = [...h.matchAll(/-H\s+"([^"]+)"/g)]
            for (let x of matches) {
               let [key, value] = x[1].split(':')
               headers[key.trim()] = value.trim()
            }
         }

         let res = await fetch(url, { headers })
         let type = res.headers.get('content-type') || ''

         if (args.includes('--headers')) {
            let data = {}
            for (let [k, v] of res.headers.entries()) { data[k] = v }
            return client.sendMetaMsg(m.chat, [{ code: { language: 'json', code: JSON.stringify(data, null, 2) } }], m, { title: 'HTTP Headers' })
         }

         if (args.includes('--status') || (args.includes('--less') && args.includes('-s'))) {
            return client.reply(m.chat, `HTTP Status: ${res.status}`, m)
         }

         if (args.includes('--cok')) {
            return client.reply(m.chat, res.headers.get('set-cookie') || 'Sin cookies', m)
         }

         const contentLength = Number(res.headers.get('content-length') || 0)
         if (contentLength > max_download) {
            return client.reply(m.chat,
               `${setting.emoji} El archivo pesa ${Utils.formatNumber(Math.round(contentLength / 1024 / 1024))}MB — supera el límite de ${Utils.formatNumber(max_download / 1024 / 1024)}MB permitido.`, m)
         }

         if (type.includes('image') || type.includes('video') || type.includes('audio')) {
            let filename = getFilename(res.headers, url, type)
            try {
               return await client.sendFile(m.chat, url, filename, '', m)
            } catch {
               return client.sendMessage(m.chat, { [type.split('/')[0]]: { url } }, { quoted: m })
            }
         }

         let body = await res.text()
         let language = detectLanguage(type, url)

         if (type.includes('json') || args.includes('--json') || language !== 'text') {
            try {
               body = JSON.stringify(JSON.parse(body), null, 2)
            } catch {}
            if (body.length <= meta_limit) {
               return client.sendMetaMsg(m.chat, [{ code: { language, code: body } }], m, { title: url, mentions: [m.sender] })
            }
            return client.reply(m.chat, body.slice(0, text_limit), m)
         }

         return client.reply(m.chat, body.slice(0, text_limit), m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   }
}
