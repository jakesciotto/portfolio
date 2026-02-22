/**
 * import-spotify-data.mjs
 *
 * One-time script that reads Spotify Extended Streaming History JSON files,
 * computes aggregated stats, and writes 5 Redis keys to Upstash.
 *
 * Usage:
 *   node scripts/import-spotify-data.mjs <path-to-spotify-export-folder>
 *
 * Env vars required:
 *   KV_REST_API_URL   - Upstash Redis REST URL
 *   KV_REST_API_TOKEN - Upstash Redis REST token
 */

import { Redis } from '@upstash/redis'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

// ---------------------------------------------------------------------------
// 1. Validate CLI args and env vars
// ---------------------------------------------------------------------------

const folderPath = process.argv[2]

if (!folderPath) {
  console.error('Usage: node scripts/import-spotify-data.mjs <spotify-export-folder>')
  process.exit(1)
}

const redisUrl = process.env.KV_REST_API_URL
const redisToken = process.env.KV_REST_API_TOKEN

if (!redisUrl || !redisToken) {
  console.error('Missing env vars: KV_REST_API_URL and KV_REST_API_TOKEN must be set.')
  process.exit(1)
}

const redis = new Redis({ url: redisUrl, token: redisToken })

// ---------------------------------------------------------------------------
// 2. Read all Streaming_History_Audio_*.json files
// ---------------------------------------------------------------------------

console.log(`Reading files from: ${folderPath}`)

const allFiles = await readdir(folderPath)
const audioFiles = allFiles
  .filter((f) => f.startsWith('Streaming_History_Audio_') && f.endsWith('.json'))
  .sort()

if (audioFiles.length === 0) {
  console.error('No Streaming_History_Audio_*.json files found in the specified folder.')
  process.exit(1)
}

console.log(`Found ${audioFiles.length} audio history files.`)

let allEntries = []

for (const file of audioFiles) {
  const raw = await readFile(join(folderPath, file), 'utf8')
  const entries = JSON.parse(raw)
  allEntries = allEntries.concat(entries)
  console.log(`  ${file}: ${entries.length} entries`)
}

console.log(`Total raw entries: ${allEntries.length}`)

// ---------------------------------------------------------------------------
// 3. Process entries
// ---------------------------------------------------------------------------

// Accumulators
const artistMs = new Map()       // artist -> total ms
const trackMs = new Map()        // "track|||artist" -> total ms
const trackPlayCount = new Map() // "track|||artist" -> play count (ms > 30000)
const yearMs = new Map()         // year -> total ms

let totalMs = 0
let totalStreams = 0
const uniqueArtists = new Set()
const uniqueTracks = new Set()
let firstTs = null
let lastTs = null

// Per-day accumulators for peak day
const dayMs = new Map()          // "YYYY-MM-DD" -> total ms

for (const entry of allEntries) {
  const ms = entry.ms_played || 0
  const artist = entry.master_metadata_album_artist_name
  const track = entry.master_metadata_track_name
  const ts = entry.ts

  // Skip entries with no track/artist metadata (podcasts, null entries)
  if (!artist || !track) continue

  totalMs += ms
  totalStreams++

  uniqueArtists.add(artist)
  uniqueTracks.add(`${track}|||${artist}`)

  // First / last stream
  if (!firstTs || ts < firstTs) firstTs = ts
  if (!lastTs || ts > lastTs) lastTs = ts

  // Artist listening time
  artistMs.set(artist, (artistMs.get(artist) || 0) + ms)

  // Track listening time
  const trackKey = `${track}|||${artist}`
  trackMs.set(trackKey, (trackMs.get(trackKey) || 0) + ms)

  // Track play count (only streams > 30 seconds)
  if (ms > 30000) {
    trackPlayCount.set(trackKey, (trackPlayCount.get(trackKey) || 0) + 1)
  }

  // Yearly hours
  const year = ts.slice(0, 4)
  yearMs.set(year, (yearMs.get(year) || 0) + ms)

  // Peak day
  const day = ts.slice(0, 10)
  dayMs.set(day, (dayMs.get(day) || 0) + ms)
}

// ---------------------------------------------------------------------------
// 4. Compute aggregated stats
// ---------------------------------------------------------------------------

const totalHours = Math.round((totalMs / 3_600_000) * 10) / 10

// -- Overview --
const overview = {
  totalHours,
  totalStreams,
  uniqueArtists: uniqueArtists.size,
  uniqueTracks: uniqueTracks.size,
  firstStream: firstTs,
  lastStream: lastTs,
}

// -- Top 10 Artists by listening time --
const topArtists = [...artistMs.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([name, ms]) => ({
    name,
    hours: Math.round((ms / 3_600_000) * 10) / 10,
  }))

// -- Top 10 Tracks by listening time --
const topTracks = [...trackMs.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([key, ms]) => {
    const [name, artist] = key.split('|||')
    return {
      name,
      artist,
      minutes: Math.round((ms / 60_000) * 10) / 10,
    }
  })

// -- Yearly hours --
const yearlyHours = [...yearMs.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([year, ms]) => ({
    year,
    hours: Math.round((ms / 3_600_000) * 10) / 10,
  }))

// -- Fun facts --

// Most played track by play count (ms > 30000)
const mostPlayedEntry = [...trackPlayCount.entries()].sort((a, b) => b[1] - a[1])[0]
const [mostPlayedKey, mostPlayedPlays] = mostPlayedEntry || ['|||', 0]
const [mostPlayedTrack, mostPlayedTrackArtist] = mostPlayedKey.split('|||')

// Top artist name and percent of total
const topArtistEntry = topArtists[0]
const topArtistPercent =
  topArtistEntry
    ? Math.round(((artistMs.get(topArtistEntry.name) / totalMs) * 100) * 10) / 10
    : 0

// Peak day
const peakDayEntry = [...dayMs.entries()].sort((a, b) => b[1] - a[1])[0]
const [peakDay, peakDayMs] = peakDayEntry || ['', 0]

const funFacts = {
  mostPlayedTrack,
  mostPlayedTrackArtist,
  mostPlayedTrackPlays: mostPlayedPlays,
  topArtistName: topArtistEntry?.name || '',
  topArtistPercent,
  peakDay,
  peakDayHours: Math.round((peakDayMs / 3_600_000) * 10) / 10,
}

// ---------------------------------------------------------------------------
// 5. Write to Redis
// ---------------------------------------------------------------------------

console.log('\nWriting to Redis...')

const keys = {
  'spotify:overview': overview,
  'spotify:top_artists': topArtists,
  'spotify:top_tracks': topTracks,
  'spotify:yearly_hours': yearlyHours,
  'spotify:fun_facts': funFacts,
}

for (const [key, value] of Object.entries(keys)) {
  await redis.set(key, JSON.stringify(value))
  console.log(`  SET ${key}`)
}

// ---------------------------------------------------------------------------
// 6. Print summary
// ---------------------------------------------------------------------------

console.log('\n--- Summary ---')
console.log(`Total listening hours: ${overview.totalHours}`)
console.log(`Total streams: ${overview.totalStreams}`)
console.log(`Unique artists: ${overview.uniqueArtists}`)
console.log(`Unique tracks: ${overview.uniqueTracks}`)
console.log(`Date range: ${overview.firstStream} to ${overview.lastStream}`)
console.log(`Top artist: ${topArtists[0]?.name} (${topArtists[0]?.hours} hrs)`)
console.log(`Most played track: "${mostPlayedTrack}" by ${mostPlayedTrackArtist} (${mostPlayedPlays} plays)`)
console.log(`Peak day: ${peakDay} (${funFacts.peakDayHours} hrs)`)
console.log(`\nYearly hours:`)
for (const yh of yearlyHours) {
  console.log(`  ${yh.year}: ${yh.hours} hrs`)
}
console.log('\nDone. 5 Redis keys written successfully.')
