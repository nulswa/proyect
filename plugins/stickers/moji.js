import { stickerEmoji } from '@mochi/toolkit'

export const run = {
   usage: ['moji'],
   use: 'text',
   category: 'stickers',
   async: async (m, { client, text, setting, Utils, isPrefix, command }) => {
      if (!text?.trim()) {
         return client.reply(m.chat, `${Utils.example(isPrefix, command, '😋')}`, m)
      }

      const parts = text.split('|').map(v => v.trim())
      const input = parts[0]
      const packname = parts[1] || setting.sk_pack
      const author = parts[2] || m.pushName || setting.sk_author

      if (!input) {
         return client.reply(m.chat, `${Utils.example(isPrefix, command, '😋')}`, m)
      }

      await client.sendReact(m.chat, setting.timeLoad, m.key)

      try {
         const res = await stickerEmoji.getSticker(input, { packname, author })

         if (!res.ok) {
            return client.reply(m.chat, `${res.error}`, m)
         }

         return await client.sendSticker(m.chat, res.buffer, m, { packname, author, meta: true })
      } catch (e) {
         console.log('[moji]', e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
