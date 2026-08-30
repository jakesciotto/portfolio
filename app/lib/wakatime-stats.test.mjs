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
      { name: 'Markdown', percent: 33.94 },
      { name: 'Other', percent: 19.54 },
      { name: 'HTML', percent: 13.3 },
    ],
    ai_model_breakdown: [
      { name: 'Sonnet', lines: 7136, cost: 22.8 },
      { name: 'Fable', lines: 4890, cost: 140 },
      { name: 'Opus', lines: 3060, cost: 198 },
      { name: 'Claude-Code', lines: 0, cost: 19.7 },
    ],
  },
}
const year = {
  data: {
    languages: [
      { name: 'Markdown', percent: 39.7 },
      { name: 'JavaScript', percent: 18.19 },
      { name: 'Python', percent: 7.03 },
      { name: 'Other', percent: 6.32 },
      { name: 'YAML', percent: 6.09 },
      { name: 'TypeScript', percent: 5.74 },
      { name: 'JSON', percent: 4.11 },
      { name: 'HTML', percent: 2.8 },
      { name: 'Bash', percent: 2.75 },
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
  const out = mapWakaStats({ allTime, stats, year, summaries })
  assert.equal(out.totalHours, 966)
  assert.equal(out.dailyAverage, '3 hrs 46 mins')
  assert.equal(out.weekTotal, '18 hrs 54 mins')
  assert.deepEqual(out.bestDay, { date: '2026-08-28', text: '10 hrs 45 mins' })
  assert.equal(out.days.length, 3)
  assert.deepEqual(out.days[1], { date: '2026-08-24', seconds: 17460, text: '4 hrs 51 mins' })
})

test('mapWakaStats takes languages from the year, drops noise, keeps six', () => {
  const out = mapWakaStats({ allTime, stats, year, summaries })
  assert.equal(out.languagesRange, 'last 12 months')
  assert.deepEqual(
    out.languages.map((l) => l.name),
    ['Markdown', 'JavaScript', 'Python', 'YAML', 'TypeScript', 'HTML'],
  )
  assert.equal(out.languages[0].percent, 39.7)
})

test('mapWakaStats falls back to the week when the year is missing', () => {
  const out = mapWakaStats({ allTime, stats, year: null, summaries })
  assert.equal(out.languagesRange, 'last 7 days')
  assert.deepEqual(
    out.languages.map((l) => l.name),
    ['Markdown', 'HTML'],
  )
})

test('mapWakaStats drops zero-line models and sorts by lines', () => {
  const out = mapWakaStats({ allTime, stats, year, summaries })
  assert.deepEqual(out.models, [
    { name: 'Sonnet', lines: 7136 },
    { name: 'Fable', lines: 4890 },
    { name: 'Opus', lines: 3060 },
  ])
})

test('mapWakaStats tolerates missing sources', () => {
  const out = mapWakaStats({})
  assert.equal(out.totalHours, null)
  assert.equal(out.weekTotal, null)
  assert.equal(out.bestDay, null)
  assert.deepEqual(out.days, [])
  assert.deepEqual(out.languages, [])
  assert.deepEqual(out.models, [])
})
