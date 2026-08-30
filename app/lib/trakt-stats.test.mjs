import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mapTraktStats } from './trakt-stats.mjs'

const stats = {
  movies: { plays: 307, watched: 305, minutes: 36649 },
  shows: { watched: 127 },
  episodes: { plays: 2746, watched: 2720, minutes: 100119 },
}
const watchedShows = [
  { plays: 195, show: { title: 'The Office' } },
  { plays: 200, show: { title: "Bob's Burgers" } },
  { plays: 159, show: { title: 'Criminal Minds' } },
  { plays: 122, show: { title: 'Parks and Recreation' } },
  { plays: 104, show: { title: 'Superstore' } },
  { plays: 103, show: { title: 'Trailer Park Boys' } },
  { plays: 7, show: null },
]
const history = [
  { type: 'episode', show: { title: 'The Last Ship' } },
  { type: 'episode', show: { title: 'The Last Ship' } },
  { type: 'movie', movie: { title: 'Mission: Impossible' } },
]

test('mapTraktStats keeps the all-time trio', () => {
  const out = mapTraktStats({ stats, watchedShows, history })
  assert.equal(out.movies, 305)
  assert.equal(out.episodes, 2720)
  assert.equal(out.hours, 2279)
})

test('mapTraktStats ranks the top five shows by plays', () => {
  const out = mapTraktStats({ stats, watchedShows, history })
  assert.deepEqual(out.topShows, [
    { title: "Bob's Burgers", plays: 200 },
    { title: 'The Office', plays: 195 },
    { title: 'Criminal Minds', plays: 159 },
    { title: 'Parks and Recreation', plays: 122 },
    { title: 'Superstore', plays: 104 },
  ])
})

test('mapTraktStats counts the last 30 days by type', () => {
  const out = mapTraktStats({ stats, watchedShows, history })
  assert.deepEqual(out.last30, { episodes: 2, movies: 1 })
})

test('mapTraktStats tolerates missing sources', () => {
  assert.deepEqual(mapTraktStats({}), {
    movies: 0,
    episodes: 0,
    hours: 0,
    topShows: [],
    last30: { episodes: 0, movies: 0 },
  })
})
