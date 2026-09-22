import { test } from 'node:test'
import assert from 'node:assert/strict'
import { liveCounter, spotifyView, withLive } from './spotify-view.mjs'

const stats = {
  overview: {
    totalHours: 13385.4,
    totalStreams: 391430,
    uniqueArtists: 9436,
    uniqueTracks: 41631,
    firstStream: '2015-09-06T00:24:17Z',
    lastStream: '2026-02-19T23:54:02Z',
  },
  topArtists: [
    { name: 'Future', hours: 587.8 },
    { name: 'Lil Baby', hours: 554.9 },
    { name: 'Dead & Company', hours: 475.2 },
    { name: 'Drake', hours: 459.8 },
    { name: 'The Holdup', hours: 345.7 },
    { name: 'Gunna', hours: 335.4 },
    { name: 'Seventh', hours: 300 },
  ],
  topTracks: [{ name: 'March Madness', artist: 'Future', minutes: 4172.7 }],
  yearlyHours: [
    { year: '2024', hours: 1640.4 },
    { year: '2025', hours: 1826.8 },
    { year: '2026', hours: 286.8 },
  ],
  funFacts: {
    mostPlayedTrack: 'March Madness',
    mostPlayedTrackArtist: 'Future',
    mostPlayedTrackPlays: 1098,
    topArtistName: 'Future',
    topArtistPercent: 4.4,
  },
}

test('spotifyView builds the hero', () => {
  assert.equal(spotifyView(stats).hours, '13,385')
})

test('spotifyView marks the unfinished last year partial and captions hours', () => {
  const v = spotifyView(stats)
  assert.deepEqual(
    v.yearly.map((y) => y.label),
    ["'24", "'25", "'26"],
  )
  assert.equal(v.yearly[1].caption, '1,827h')
  assert.equal(v.yearly[1].text, '2025 · 1,827h')
  assert.equal(v.yearly[1].partial, false)
  assert.equal(v.yearly[2].text, '2026 · 287h so far')
  assert.equal(v.yearly[2].partial, true)
  const december = spotifyView({
    ...stats,
    overview: { ...stats.overview, lastStream: '2026-12-19T00:00:00Z' },
  })
  assert.equal(december.yearly[2].partial, false)
  assert.equal(december.yearly[2].text, '2026 · 287h')
})

test('spotifyView leads with the top artist and bars the next five', () => {
  const v = spotifyView(stats)
  assert.deepEqual(v.lead, { name: 'Future', hours: 588, sharePct: 4.4 })
  assert.equal(v.bars.length, 5)
  assert.deepEqual(v.bars[0], { name: 'Lil Baby', hours: 555, width: 94 })
})

test('spotifyView returns null without an overview', () => {
  assert.equal(spotifyView({ overview: null }), null)
  assert.equal(spotifyView(null), null)
})

test('withLive grows the current year and the total by the live gain', () => {
  const live = {
    year: 2026,
    minutes: 75_696,
    lastStream: '2026-09-22T22:18:08.082Z',
  }
  const merged = withLive(stats, live)
  const year = merged.yearlyHours.find((y) => y.year === '2026')
  assert.equal(year.hours, 1261.6)
  assert.equal(merged.overview.totalHours, round1(13385.4 + 1261.6 - 286.8))
  assert.equal(merged.overview.lastStream, '2026-09-22T22:18:08.082Z')
  assert.equal(merged.yearlyHours.length, 3)
  assert.equal(stats.yearlyHours[2].hours, 286.8)
  const v = spotifyView(merged)
  assert.equal(v.hours, '14,360')
  assert.equal(v.yearly[2].text, '2026 · 1,262h so far')
})

test('withLive never lowers a value and ignores a missing live key', () => {
  assert.equal(withLive(stats, { year: 2026, minutes: 60 }), stats)
  assert.equal(withLive(stats, null), stats)
  assert.equal(withLive(stats, { minutes: 90_000 }), stats)
  assert.equal(withLive(null, { year: 2026, minutes: 60 }), null)
})

test('withLive adds a column for a year the stats do not hold yet', () => {
  const merged = withLive(stats, { year: 2027, minutes: 600 })
  assert.deepEqual(merged.yearlyHours.at(-1), { year: '2027', hours: 10 })
  assert.equal(merged.overview.totalHours, 13395.4)
})

test('liveCounter formats minutes and hides an empty key', () => {
  assert.deepEqual(liveCounter({ year: 2026, minutes: 75_696.4 }), {
    minutes: '75,696',
    year: '2026',
  })
  assert.equal(liveCounter({ year: 2026, minutes: 0 }), null)
  assert.equal(liveCounter(null), null)
})

function round1(n) {
  return Math.round(n * 10) / 10
}
