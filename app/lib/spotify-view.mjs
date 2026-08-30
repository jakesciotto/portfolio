function round(n) {
  return Math.round(Number(n) || 0)
}

export function spotifyView(stats) {
  const o = stats?.overview
  if (!o) return null

  const totalHours = Number(o.totalHours) || 0
  const last = o.lastStream ? new Date(o.lastStream) : null
  const lastYear = last ? String(last.getUTCFullYear()) : null
  const lastMonth = last ? last.getUTCMonth() : null

  const yearly = (stats.yearlyHours || [])
    .filter((y) => !(y.year === lastYear && lastMonth != null && lastMonth < 11))
    .map((y) => {
      const hours = `${round(y.hours).toLocaleString('en-US')}h`
      return { label: `'${String(y.year).slice(2)}`, value: y.hours, caption: hours, text: `${y.year} · ${hours}` }
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
          (totalHours ? Math.round((top.hours / totalHours) * 1000) / 10 : null),
      }
    : null
  const bars = artists.slice(1, 6).map((a) => ({
    name: a.name,
    hours: round(a.hours),
    width: top?.hours ? Math.round((a.hours / top.hours) * 100) : 0,
  }))

  const track = stats.topTracks?.[0]
  let onRepeat = null
  if (ff?.mostPlayedTrack) {
    onRepeat = { name: ff.mostPlayedTrack, artist: ff.mostPlayedTrackArtist, plays: ff.mostPlayedTrackPlays ?? null }
  } else if (track) {
    onRepeat = { name: track.name, artist: track.artist, plays: null }
  }

  return {
    hours: round(totalHours).toLocaleString('en-US'),
    yearly,
    lead,
    bars,
    onRepeat,
  }
}
