const HOUR = 3_600_000
const MINUTE = 60_000
const PLAY_THRESHOLD_MS = 30_000

const round1 = (n) => Math.round(n * 10) / 10

export function aggregate(entries) {
  const artistMs = new Map()
  const trackMs = new Map()
  const trackPlays = new Map()
  const yearMs = new Map()
  const dayMs = new Map()
  const uniqueArtists = new Set()
  let totalMs = 0
  let totalStreams = 0
  let firstTs = null
  let lastTs = null

  for (const entry of entries) {
    const artist = entry.artist
    const track = entry.track
    if (!artist || !track) continue
    const ms = entry.ms_played || 0
    const ts = entry.ts
    const key = `${track}|||${artist}`

    totalMs += ms
    totalStreams++
    uniqueArtists.add(artist)
    if (!firstTs || ts < firstTs) firstTs = ts
    if (!lastTs || ts > lastTs) lastTs = ts

    artistMs.set(artist, (artistMs.get(artist) || 0) + ms)
    trackMs.set(key, (trackMs.get(key) || 0) + ms)
    if (ms > PLAY_THRESHOLD_MS) {
      trackPlays.set(key, (trackPlays.get(key) || 0) + 1)
    }
    const year = String(new Date(ts).getFullYear())
    yearMs.set(year, (yearMs.get(year) || 0) + ms)
    const day = ts.slice(0, 10)
    dayMs.set(day, (dayMs.get(day) || 0) + ms)
  }

  const byValueDesc = (a, b) => b[1] - a[1]

  const topArtists = [...artistMs.entries()]
    .sort(byValueDesc)
    .slice(0, 10)
    .map(([name, ms]) => ({ name, hours: round1(ms / HOUR) }))

  const topTracks = [...trackMs.entries()]
    .sort(byValueDesc)
    .slice(0, 10)
    .map(([key, ms]) => {
      const [name, artist] = key.split('|||')
      return { name, artist, minutes: round1(ms / MINUTE) }
    })

  const yearlyHours = [...yearMs.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([year, ms]) => ({ year, hours: round1(ms / HOUR) }))

  const [mostPlayedKey, mostPlayedPlays] = [...trackPlays.entries()].sort(
    byValueDesc,
  )[0] || ['|||', 0]
  const [mostPlayedTrack, mostPlayedTrackArtist] = mostPlayedKey.split('|||')
  const topArtist = topArtists[0]
  const [peakDay, peakDayMs] = [...dayMs.entries()].sort(byValueDesc)[0] || [
    '',
    0,
  ]

  return {
    overview: {
      totalHours: round1(totalMs / HOUR),
      totalStreams,
      uniqueArtists: uniqueArtists.size,
      uniqueTracks: trackMs.size,
      firstStream: firstTs,
      lastStream: lastTs,
    },
    topArtists,
    topTracks,
    yearlyHours,
    funFacts: {
      mostPlayedTrack,
      mostPlayedTrackArtist,
      mostPlayedTrackPlays: mostPlayedPlays,
      topArtistName: topArtist?.name || '',
      topArtistPercent:
        topArtist && totalMs
          ? round1((artistMs.get(topArtist.name) / totalMs) * 100)
          : 0,
      peakDay,
      peakDayHours: round1(peakDayMs / HOUR),
    },
  }
}

// Minutes in the current calendar year, in the process time zone (TZ). The
// archive supplies the base for the year and collected plays add to it.
export function liveSummary(entries, now = new Date()) {
  const year = now.getFullYear()
  const start = new Date(year, 0, 1).toISOString()
  let ms = 0
  let streams = 0
  let since = null
  let lastStream = null
  for (const e of entries) {
    if (!e.artist || !e.track) continue
    if (new Date(e.ts).toISOString() < start) continue
    ms += e.ms_played || 0
    streams++
    if (!since || e.ts < since) since = e.ts
    if (!lastStream || e.ts > lastStream) lastStream = e.ts
  }
  return {
    year,
    minutes: Math.round(ms / MINUTE),
    streams,
    since,
    lastStream,
  }
}

export const LIVE_KEY = 'spotify:live'

export const REDIS_KEYS = {
  overview: 'spotify:overview',
  topArtists: 'spotify:top_artists',
  topTracks: 'spotify:top_tracks',
  yearlyHours: 'spotify:yearly_hours',
  funFacts: 'spotify:fun_facts',
}
