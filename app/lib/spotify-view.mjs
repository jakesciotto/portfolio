function round(n) {
  return Math.round(Number(n) || 0)
}

const round1 = (n) => Math.round(n * 10) / 10

// The live key and the stats keys come from one database, but the stats reach
// the browser through a one hour cache. The live year never lowers a value.
export function withLive(stats, live) {
  const o = stats?.overview
  const minutes = Number(live?.minutes)
  if (!o || !live?.year || !(minutes > 0)) return stats

  const year = String(live.year)
  const liveHours = minutes / 60
  const yearly = stats.yearlyHours || []
  const current = yearly.find((y) => String(y.year) === year)
  const gain = Math.max(0, liveHours - (Number(current?.hours) || 0))
  if (!gain) return stats

  const yearlyHours = current
    ? yearly.map((y) =>
        y === current ? { ...y, hours: round1(liveHours) } : y,
      )
    : [...yearly, { year, hours: round1(liveHours) }]
  const lastStream =
    live.lastStream && (!o.lastStream || live.lastStream > o.lastStream)
      ? live.lastStream
      : o.lastStream

  return {
    ...stats,
    overview: {
      ...o,
      totalHours: round1((Number(o.totalHours) || 0) + gain),
      lastStream,
    },
    yearlyHours,
  }
}

export function liveCounter(live) {
  const minutes = Math.round(Number(live?.minutes) || 0)
  if (!live?.year || minutes <= 0) return null
  return { minutes: minutes.toLocaleString('en-US'), year: String(live.year) }
}

export function spotifyView(stats) {
  const o = stats?.overview
  if (!o) return null

  const totalHours = Number(o.totalHours) || 0
  const last = o.lastStream ? new Date(o.lastStream) : null
  const lastYear = last ? String(last.getUTCFullYear()) : null
  const lastMonth = last ? last.getUTCMonth() : null

  const yearly = (stats.yearlyHours || []).map((y) => {
    const hours = `${round(y.hours).toLocaleString('en-US')}h`
    const partial = y.year === lastYear && lastMonth != null && lastMonth < 11
    return {
      label: `'${String(y.year).slice(2)}`,
      value: y.hours,
      caption: hours,
      text: partial ? `${y.year} · ${hours} so far` : `${y.year} · ${hours}`,
    }
  })

  const artists = stats.topArtists || []
  const top = artists[0]
  const ff = stats.funFacts
  const lead = top
    ? {
        name: top.name,
        hours: round(top.hours),
        sharePct:
          ff?.topArtistPercent ??
          (totalHours
            ? Math.round((top.hours / totalHours) * 1000) / 10
            : null),
      }
    : null
  const bars = artists.slice(1, 6).map((a) => ({
    name: a.name,
    hours: round(a.hours),
    width: top?.hours ? Math.round((a.hours / top.hours) * 100) : 0,
  }))

  return {
    hours: round(totalHours).toLocaleString('en-US'),
    yearly,
    lead,
    bars,
  }
}
