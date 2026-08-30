import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spotifyView } from './spotify-view.mjs'

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

test('spotifyView drops the unfinished last year and captions hours', () => {
  const v = spotifyView(stats)
  assert.deepEqual(v.yearly.map((y) => y.label), ["'24", "'25"])
  assert.equal(v.yearly[1].caption, '1,827h')
  assert.equal(v.yearly[1].text, '2025 · 1,827h')
  const december = spotifyView({ ...stats, overview: { ...stats.overview, lastStream: '2026-12-19T00:00:00Z' } })
  assert.equal(december.yearly.length, 3)
})

test('spotifyView leads with the top artist and bars the next five', () => {
  const v = spotifyView(stats)
  assert.deepEqual(v.lead, { name: 'Future', hours: 588, sharePct: 4.4 })
  assert.equal(v.bars.length, 5)
  assert.deepEqual(v.bars[0], { name: 'Lil Baby', hours: 555, width: 94 })
})

test('spotifyView uses fun facts for on repeat and falls back to the top track', () => {
  assert.deepEqual(spotifyView(stats).onRepeat, { name: 'March Madness', artist: 'Future', plays: 1098 })
  const noFacts = spotifyView({ ...stats, funFacts: null })
  assert.deepEqual(noFacts.onRepeat, { name: 'March Madness', artist: 'Future', plays: null })
  assert.equal(noFacts.lead.sharePct, 4.4)
})

test('spotifyView returns null without an overview', () => {
  assert.equal(spotifyView({ overview: null }), null)
  assert.equal(spotifyView(null), null)
})
