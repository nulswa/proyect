/*
 * Functions to bypass Cloudflare, not optimized nor that advanced,
 * so if it fails there won't be any alternative or fix planned in the future.
 * Alternative code made by @alex_nix
*/

import fetch from 'node-fetch'
import cloudscraper from 'cloudscraper'
import { chromium } from 'playwright'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const TEMP = './temp'
const TIMEOUT = 30000


async function ensureTemp() {
   await fs.mkdir(TEMP, { recursive: true })
}

function createResponse(body, status = 200, headers = {}) {

   let map = new Map(Object.entries(headers))

   return {
      status,
      headers: {
         get(name) {
            return map.get(
               [...map.keys()]
               .find(x => x.toLowerCase() === name.toLowerCase())
            ) || null
         },
         entries() {
            return map.entries()
         }
      },
      text: async () => body,
      buffer: async () => Buffer.from(body),
      arrayBuffer: async () =>
         Buffer.from(body).buffer
   }
}

function timeout(ms = TIMEOUT) {
   return new Promise((_, reject) => {
      setTimeout(() => {
         reject(
         new Error('Request timeout')
         )
      }, ms)
   })

}

async function normalRequest(url, headers) {
   let controller = new AbortController()
   let timer = setTimeout(() => {
      controller.abort()
      }, TIMEOUT)
   try {
      return await fetch(url, {
         headers,
         signal: controller.signal
      })
   } finally {
      clearTimeout(timer)
   }
}

async function bypassRequest(url, headers) {
   let result = await Promise.race([
      cloudscraper.get({
         uri: url,
         headers,
         resolveWithFullResponse: true
      }),
      timeout()
   ])
   let body = result.body || result
   let responseHeaders = result.headers || {}
   let status = result.statusCode || 200
   return createResponse(body, status, responseHeaders)
}

async function proRequest(url, headers) {
   let browser
   try {
      browser = await chromium.launch({ headless: true })
      let context = await browser.newContext({ extraHTTPHeaders: headers })
      let page = await context.newPage()
      let response = await page.goto(url, {
            waitUntil: 'networkidle',
            timeout: TIMEOUT
         })

      let html = await page.content()
      let responseHeaders = response ? await response.allHeaders() : {}
      let status = response ? response.status() : 200
      await page.close()
      await context.close()
      return createResponse(html, status, responseHeaders)
   } finally {
      if (browser) {
         await browser.close()
      }
   }
}

export async function request(url, args = [], headers = {}) {
   if (args.includes('--pro')) {
      return await proRequest(url, headers)
   }

   if (args.includes('--bypass')) {
      return await bypassRequest(url, headers)
     }
   return await normalRequest(url, headers)
}

export async function saveTemp(buffer, ext='bin') {
   await ensureTemp()
   let id = crypto.randomBytes(8).toString('hex')
   let file = path.join(TEMP, `get-${id}.${ext}`)
   await fs.writeFile(file, buffer)
   return file
}

export async function deleteTemp(file) {
   try {
      await fs.unlink(file)
   } catch {}
}

export async function cleanTemp() {
   try {
      await ensureTemp()
      let files = await fs.readdir(TEMP)
      for (let file of files) {
         await fs.unlink(path.join(TEMP, file))
      }
   } catch {}
}
