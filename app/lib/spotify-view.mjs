import { compact, monthYear } from './format.mjs'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

function round(n) {
  return Math.round(Number(n) || 0)
}

export function spotifyView(stats, { now = new Date() } = {}) {
  const o = stats?.overview
  if (!o) return null

  const totalHours = Number(o.totalHours) || 0
  const first = o.firstStream ? new Date(o.firstStream) : null
  const last = o.lastStream ? new Date(o.lastStream) : null
  const lastYear = last ? String(last.getUTCFullYear()) : null
  const lastMonth = last ? last.getUTCMonth() : null

  const yearly = (stats.yearlyHours || []).map((y) => {
    const partial = y.year === lastYear && lastMonth != null && lastMonth < 11
    const suffix = partial ? ` (to ${MONTHS[lastMonth]})` : ''
    return {
      label: `'${String(y.year).slice(2)}`,
      value: y.hours,
      partial,
      text: `${y.year}${suffix} · ${round(y.hours).toLocaleString('en-US')}h`,
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
    onRepeat = {
      name: ff.mostPlayedTrack,
      artist: ff.mostPlayedTrackArtist,
      plays: ff.mostPlayedTrackPlays ?? null,
      minutes: track && track.name === ff.mostPlayedTrack ? round(track.minutes) : null,
    }
  } else if (track) {
    onRepeat = { name: track.name, artist: track.artist, plays: null, minutes: round(track.minutes) }
  }

  const firstYear = first ? first.getUTCFullYear() : null

  return {
    hours: round(totalHours).toLocaleString('en-US'),
    since: monthYear(o.firstStream),
    yearsOfAudio: Math.round((totalHours / 24 / 365.25) * 10) / 10,
    kpis: [
      { v: compact(o.totalStreams), l: 'streams' },
      { v: compact(o.uniqueArtists), l: 'artists' },
      { v: compact(o.uniqueTracks), l: 'tracks' },
      { v: firstYear != null ? String(now.getUTCFullYear() - firstYear) : '---', l: 'years' },
    ],
    yearly,
    lead,
    bars,
    onRepeat,
    through: monthYear(o.lastStream),
  }
}
