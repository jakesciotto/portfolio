import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mapWakaStats } from './wakatime-stats.mjs'

const allTime = { data: { total_seconds: 3477600 } }
const stats = {
  data: {
    human_readable_total: '18 hrs 54 mins',
    human_readable_daily_average: '3 hrs 46 mins',
    best_day: { date: '2026-08-28', total_seconds: 38716.8, text: '10 hrs 45 mins' },
    languages: [
      { name: 'Markdown', percent: 33.94, total_seconds: 28800 },
      { name: 'Other', percent: 19.54, total_seconds: 16560 },
    ],
    projects: [
      { name: 'hogsitter', percent: 12.75, text: '2 hrs 59 mins', total_seconds: 10740 },
      { name: 'easton-duels', percent: 34.84, text: '8 hrs 11 mins', total_seconds: 29460 },
      { name: 'jakesciotto', percent: 31.82, text: '7 hrs 28 mins', total_seconds: 26880 },
      { name: 'claude-config', percent: 6.99, text: '1 hr 38 mins', total_seconds: 5880 },
      { name: 'hogpilot', percent: 3.83, text: '53 mins', total_seconds: 3180 },
    ],
    ai_model_breakdown: [
      { name: 'Sonnet', lines: 7136, cost: 22.8 },
      { name: 'Fable', lines: 4890, cost: 140 },
      { name: 'Opus', lines: 3060, cost: 198 },
      { name: 'Claude-Code', lines: 0, cost: 19.7 },
    ],
  },
}
const summaries = {
  data: [
    { range: { date: '2026-08-23' }, grand_total: { total_seconds: 0, text: '0 secs' } },
    { range: { date: '2026-08-24' }, grand_total: { total_seconds: 17460, text: '4 hrs 51 mins' } },
    { range: { date: '2026-08-28' }, grand_total: { total_seconds: 38700, text: '10 hrs 45 mins' } },
  ],
}

test('mapWakaStats maps totals and the week', () => {
  const out = mapWakaStats({ allTime, stats, summaries })
  assert.equal(out.totalHours, 966)
  assert.equal(out.dailyAverage, '3 hrs 46 mins')
  assert.equal(out.weekTotal, '18 hrs 54 mins')
  assert.deepEqual(out.bestDay, { date: '2026-08-28', text: '10 hrs 45 mins' })
  assert.equal(out.days.length, 3)
  assert.deepEqual(out.days[1], { date: '2026-08-24', seconds: 17460, text: '4 hrs 51 mins' })
})

test('mapWakaStats sorts projects by time and keeps four', () => {
  const out = mapWakaStats({ allTime, stats, summaries })
  assert.deepEqual(
    out.projects.map((p) => p.name),
    ['easton-duels', 'jakesciotto', 'hogsitter', 'claude-config'],
  )
  assert.equal(out.projects[0].text, '8 hrs 11 mins')
})

test('mapWakaStats drops zero-line models and sorts by lines', () => {
  const out = mapWakaStats({ allTime, stats, summaries })
  assert.deepEqual(out.models, [
    { name: 'Sonnet', lines: 7136 },
    { name: 'Fable', lines: 4890 },
    { name: 'Opus', lines: 3060 },
  ])
})

test('mapWakaStats tolerates missing sources', () => {
  const out = mapWakaStats({ allTime: null, stats: null, summaries: null })
  assert.equal(out.totalHours, null)
  assert.equal(out.weekTotal, null)
  assert.equal(out.bestDay, null)
  assert.deepEqual(out.days, [])
  assert.deepEqual(out.languages, [])
  assert.deepEqual(out.projects, [])
  assert.deepEqual(out.models, [])
})
