import { test } from 'node:test'
import assert from 'node:assert/strict'
import { githubView } from './github-view.mjs'

const calendar = {
  '2026-10-21': 1,
  '2026-10-22': 2,
  '2026-10-23': 3,
  '2026-10-24': 4,
  '2026-10-25': 5,
  '2026-10-26': 6,
  '2026-10-27': 7,
  '2026-10-28': 10,
  '2026-10-29': 20,
  '2026-10-30': 30,
  '2026-10-31': 40,
  '2026-11-01': 50,
  '2026-11-02': 60,
  '2026-11-03': 70,
  '2026-11-04': 0,
}

test('githubView ends the week on the local date, not a later UTC calendar day', () => {
  const view = githubView(calendar, new Date('2026-11-04T00:43:00Z'))

  assert.equal('2026-11-04' in view.days, false)
  assert.equal(Object.keys(view.days).length, 14)
  assert.deepEqual(view.daily, [10, 20, 30, 40, 50, 60, 70])
  assert.equal(view.activity7d, 280)
  assert.equal(view.prevActivity7d, 28)
  assert.equal(view.isActive, true)

  const nextMorning = githubView(calendar, new Date('2026-11-04T15:00:00Z'))
  assert.deepEqual(nextMorning.daily, [20, 30, 40, 50, 60, 70, 0])
  assert.equal(nextMorning.activity7d, 270)
})
