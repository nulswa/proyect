/*
* Reusable formatting functions:
* large numbers, times, percentages,
* file sizes, dates in Spanish and WhatsApp text styles.
*
* made by @rodrec to simplify things :v
*/

export function formatNumber(num) {
  const n = Math.trunc(Number(num) || 0)
  return n.toLocaleString('en-US') 
}

const compact_scales = [ { value: 1e24, suffix: 'Sp' }, { value: 1e21, suffix: 'Sx' }, { value: 1e18, suffix: 'Qi' }, { value: 1e15, suffix: 'Qa' }, { value: 1e12, suffix: 'T' }, { value: 1e9, suffix: 'B' }, { value: 1e6, suffix: 'M' }, { value: 1e3, suffix: 'K' } ]

export function formatCompact(num) {
  const n = Number(num) || 0
  const abs = Math.abs(n)

  for (const scale of compact_scales) {
    if (abs >= scale.value) {
      const value = (n / scale.value).toFixed(1).replace(/\.0$/, '')
      return `${value}${scale.suffix}`
    }
  }
  return String(Math.trunc(n))
}

export function formatPercent(value) {
  const n = Number(value) || 0
  const pct = Math.abs(n) <= 1 ? n * 100 : n
  return `${Math.round(pct)}%`
}

export function formatDuration(ms) {
  const pad = n => String(n).padStart(2, '0')
  const totalSec = Math.max(0, Math.floor(Number(ms) / 1000) || 0)

  const d = Math.floor(totalSec / 86400)
  const h = Math.floor((totalSec % 86400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60

  return `${pad(d)}d:${pad(h)}h:${pad(m)}m:${pad(s)}s`
}

export function formatSize(bytes) {
  const n = Number(bytes) || 0
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = n
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }

  const formatted = unitIndex === 0 ? String(Math.round(value)) : value.toFixed(2).replace(/\.00$/, '')
  return `${formatted}${units[unitIndex]}`
}

const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

export function formatDateLong(input) {
  const date = input instanceof Date ? input : new Date(input)
  if (isNaN(date.getTime())) return 'Fecha inválida'
  return `${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()}`
}

export function formatDateShort(input) {
  const date = input instanceof Date ? input : new Date(input)
  if (isNaN(date.getTime())) return 'Fecha inválida'
  const pad = n => String(n).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

export function bold(text) { return `*${text}*` }
export function italic(text) { return `_${text}_` }
export function strikethrough(text) { return `~${text}~` }
export function monospace(text) { return '```' + text + '```' }

export default {
  formatNumber, formatCompact, formatPercent, formatDuration, formatSize,
  formatDateLong, formatDateShort,
  bold, italic, strikethrough, monospace
}
