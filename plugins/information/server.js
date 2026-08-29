import os from 'node:os'

export const run = {
   usage: ['server'],
   category: 'information',
   async: async (m, { client, Utils, setting }) => {
      try {
         const json = await Utils.fetchAsJSON('http://ip-api.com/json')
         delete json.status
         delete json.query
         
         const memoryUsage = getMemoryStats()
         const cpuUsage = await getCpuPercentage()
         
let caption = `${Utils.lineBase('Server')}

◦  *Node :*  ${process.version}
◦  *Process :*  ${process.pid}
◦  *Processor :*  ${os.cpus()[0].model}
◦  *Core :*  ${os.cpus().length}
◦  *CPU usage :*  ${cpuUsage}
◦  *RAM :*  ${Utils.formatSize(process.memoryUsage().rss)} / ${Utils.formatSize(os.totalmem())}
◦  *Heap Total :*  ${memoryUsage.heapTotal}
◦  *Heap Used :*  ${memoryUsage.heapUsed}
◦  *External :*  ${memoryUsage.external}
◦  *Array Buffers :*  ${memoryUsage.arrayBuffers}
◦  *Directory :*  ${process.cwd()}
◦  *OS :*  ${os.type()} [${os.arch()} - ${os.release()}]\n`
         for (let key in json) caption += `◦ *${Utils.ucword(key)} :*  ${json[key]}\n`
         caption += `◦  *Platform :*  ${os.platform()}\n`
         caption += `◦  *Uptime :*  ${Utils.toTime(os.uptime() * 1000)}\n`
         caption += `\n${setting.botDesc}`
         
         client.sendIAMessage(m.chat, [{
            name: 'inapp_signup',
            buttonParamsJson: JSON.stringify({})
         }], m, {
            header: `${setting.emoji2}  Server information`,
            content: caption.trim()
         })
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}

function getMemoryStats() {
   const formatMemory = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`
   const memoryData = process.memoryUsage()

   return {
      rss: formatMemory(memoryData.rss),
      heapTotal: formatMemory(memoryData.heapTotal),
      heapUsed: formatMemory(memoryData.heapUsed),
      external: formatMemory(memoryData.external),
      arrayBuffers: formatMemory(memoryData.arrayBuffers || 0)
   }
}

function getCpuPercentage() {
   return new Promise(resolve => {
      const startStats = os.cpus().reduce((acc, cpu) => {
         acc.idle += cpu.times.idle
         acc.total += Object.values(cpu.times).reduce((sum, val) => sum + val, 0)
         return acc
      }, { idle: 0, total: 0 })

      setTimeout(() => {
         const endStats = os.cpus().reduce((acc, cpu) => {
            acc.idle += cpu.times.idle
            acc.total += Object.values(cpu.times).reduce((sum, val) => sum + val, 0)
            return acc
         }, { idle: 0, total: 0 })

         const idleDiff = endStats.idle - startStats.idle
         const totalDiff = endStats.total - startStats.total
         const percentage = 100 - Math.floor((idleDiff / totalDiff) * 100)

         resolve(`${percentage}%`)
      }, 100)
   })
}
