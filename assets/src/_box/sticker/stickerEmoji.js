/*
 * Fetch emojis using https://fonts.gstatic.com for animations.
 * Not all emojis may yield the same result. :v
*/

import fetch from 'node-fetch'
import sharp from 'sharp'
import webp from 'node-webpmux'
import crypto from 'crypto'

const noto_base_xd = 'https://fonts.gstatic.com/s/e/notoemoji/latest'

function emojiToCode(input) {
  input = input.trim()
  if (/^[0-9a-f]{4,}(-[0-9a-f]{4,})*$/i.test(input)) {
    return input.toLowerCase()
  }
  const points = []
  for (const char of input) {
    const cp = char.codePointAt(0)
    if (cp > 0xFFFF || (cp >= 0x200D) || cp === 0xFE0F || cp > 0x20) {
      if (cp !== 0xFE0F) points.push(cp.toString(16))
    }
  }
  return points.join('-')
}

async function fetchEmojiGif(code) {
  const url = `${noto_base_xd}/${code}/512.gif`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15_000) })

  if (!res.ok) {
    const baseCode = code.split('-')[0]
    if (baseCode !== code) {
      const res2 = await fetch(`${noto_base_xd}/${baseCode}/512.gif`, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15_000) })
      if (res2.ok) return res2.buffer()
    }
    throw new Error(`No animation found for that emoji (${code})`)
  }
  return res.buffer()
}

async function gifToWebp(gifBuffer) {
  return sharp(gifBuffer, { animated: true })
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ loop: 0, quality: 50, lossless: false })
    .toBuffer()
}

async function addExif(webpBuffer, packname = 'Farguts', author = 'Native') {
  const img = new webp.Image()
  const json = { 'sticker-pack-id': crypto.randomBytes(32).toString('hex'), 'sticker-pack-name': packname, 'sticker-pack-publisher': author, emojis: ['🍡'] }
  const exifAttr = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
  const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
  const exif = Buffer.concat([exifAttr, jsonBuffer])
  exif.writeUIntLE(jsonBuffer.length, 14, 4)
  await img.load(webpBuffer)
  img.exif = exif
  return img.save(null)
}

const stickerEmoji = {
  async getSticker(input, opts = {}) {
    try {
      const code = emojiToCode(input)
      if (!code) throw new Error('Invalid or unrecognized emoji')
      const gifBuf = await fetchEmojiGif(code)
      const webpBuf = await gifToWebp(gifBuf)
      const stickerBuf = await addExif(webpBuf, opts.packname, opts.author)
      return { ok: true, buffer: stickerBuf, code }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  },
  emojiToCode,
}

export default stickerEmoji
