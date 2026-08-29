const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export function agoLabel(iso, prefix = '', now = Date.now()) {
  if (!iso) return null
  const ms = now - new Date(iso).getTime()
  if (Number.isNaN(ms)) return null
  const hrs = Math.floor(ms / 3600000)
  const word = hrs < 1 ? 'just now' : hrs < 24 ? `${hrs}h ago` : `${Math.floor(hrs / 24)}d ago`
  return prefix ? `${prefix} ${word}` : word
}

function trimZero(s) {
  return s.replace(/\.0$/, '')
}

export function compact(n) {
  if (n == null || Number.isNaN(Number(n))) return '---'
  const v = Number(n)
  if (v < 10000) return v.toLocaleString('en-US')
  if (v < 100000) return `${trimZero((v / 1000).toFixed(1))}k`
  if (v < 1000000) return `${Math.round(v / 1000)}k`
  return `${trimZero((v / 1000000).toFixed(1))}m`
}

export function hoursToDays(h) {
  return Math.round((Number(h) || 0) / 24)
}

export function pct(part, total) {
  if (!total) return 0
  return Math.round(((Number(part) || 0) / total) * 100)
}

export function monthYear(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export function weekdayShort(isoDate) {
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return ''
  return DAYS[d.getUTCDay()]
}

export function shortDuration(text) {
  if (!text) return '---'
  if (/^0 secs?$/.test(text)) return '0'
  const parts = []
  const h = text.match(/(\d+)\s*hrs?/)
  const m = text.match(/(\d+)\s*mins?/)
  if (h) parts.push(`${h[1]}h`)
  if (m) parts.push(`${m[1]}m`)
  return parts.length ? parts.join(' ') : text
}
