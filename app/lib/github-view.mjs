const SITE_TIME_ZONE = 'America/Denver'

const localDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: SITE_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const sum = (counts) => counts.reduce((total, count) => total + count, 0)

export function githubView(countByDate, now = new Date()) {
  const today = localDateFormat.format(now)
  const days = Object.fromEntries(
    Object.entries(countByDate).filter(([date]) => date <= today),
  )
  const series = Object.keys(days)
    .sort()
    .map((date) => days[date])
  const daily = series.slice(-7)

  return {
    activity7d: sum(daily),
    prevActivity7d: sum(series.slice(-14, -7)),
    daily,
    isActive: daily.slice(-2).some((count) => count > 0),
    days,
  }
}
