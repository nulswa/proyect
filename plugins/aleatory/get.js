import fetch from 'node-fetch'

function detectLanguage(type, url) {
   const ext = url.split('.').pop()?.toLowerCase()
   const map = { json: 'json', html: 'html', htm: 'html', js: 'javascript', css: 'css', py: 'python', xml: 'xml' }
   return map[ext] || (type.includes('json') ? 'json' : type.includes('html') ? 'html' : 'text')
}


function getFilename(headers, url) {
   const disposition = headers.get('content-disposition')
   if (disposition) {
      const match = disposition.match(/filename="?(.+)"?/)
      if (match) return match[1]
   }

   const name = url.split('/').pop()

   if (name && name.includes('.')) {
      return name
   }

   return `Download-${new Date().toLocaleString().replace(/[/:]/g,'-')}`
}


export const run = {
   usage: ['get'],
   hidden: ['fetch'],
   use: 'url',
   category: 'aleatory',
   async: async (m, { client, text, isPrefix, command, Utils, setting }) => {
      try {
let examText = `${Utils.lineBase('Fetch')}
${setting.emoji2}  Realiza peticiones *HTTP* para obtener información.

◦  *--less* 
\t» devuelve body *(texto)*

◦  *--headers* 
\t» devuelve headers

◦  *--status* 
\t» devuelve status HTTP

◦  *--cok*
\t» devuelve cookies

◦  *--json*
\t» fuerza salida JSON

◦  *--curl*
\t» permite headers estilo curl

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
               let [key,value] = x[1].split(':')
               headers[key.trim()] = value.trim()
            }
         }
         let res = await fetch(url, { headers })
         let type = res.headers.get('content-type') || ''

         if (args.includes('--headers')) {
            let data = {}
            for (let [k,v] of res.headers.entries()) { data[k]=v }
            return client.sendMetaMsg(m.chat, [{ code:{ language: 'json', code:JSON.stringify(data,null,2) }}], m, { title:'HTTP Headers' })
}

         if (args.includes('--status') || args.includes('--less') && args.includes('-s')) {
            return client.reply(m.chat, `HTTP Status: ${res.status}`, m)}

         if(args.includes('--cok')) {
            return client.reply(m.chat, res.headers.get('set-cookie') || 'Sin cookies', m )
}

         if(type.includes('image') || type.includes('video') || type.includes('audio')) {
            let thumb = setting.waImg
            let filename = getFilename(res.headers, url)
            try {
               return await client.sendFile(m.chat, url, filename, '', m, { document: true, APIC: await Utils.fetchAsBuffer(thumb) }, { jpegThumbnail: await Utils.generateImageThumbnail(thumb) })
            } catch {
               return client.sendMessage(m.chat, { [type.split('/')[0]]: { url }}, { quoted: m })
}
}

         let body = await res.text()
         let language = detectLanguage(type,url)
         if ( type.includes('json') || args.includes('--json') || language !== 'text' ){

            try {
               body = JSON.stringify(JSON.parse(body), null, 2)
            } catch {}

            return client.sendMetaMsg(m.chat, [{ code: { language, code:body.slice(0,65000) }}], m, { title:url, mentions: [m.sender] })
         }

         return client.reply(m.chat, body.slice(0,65000), m )
      } catch(e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   }
}