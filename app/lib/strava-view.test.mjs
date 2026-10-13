import { test } from 'node:test'
import assert from 'node:assert/strict'
import { breakdownColumns } from './strava-view.mjs'

const breakdown = [
  { type: 'Run', count: 40 },
  { type: 'Weights', count: 90 },
  { type: 'Golf', count: 1 },
  { type: 'Swim', count: 12 },
  { type: 'Yoga', count: 7 },
]

test('breakdownColumns keeps every workout type once, in count order', () => {
  const { max, columns } = breakdownColumns(breakdown)
  const flat = columns.flat()
  assert.equal(max, 90)
  assert.deepEqual(
    flat.map((t) => t.type),
    ['Weights', 'Run', 'Swim', 'Yoga', 'Golf'],
  )
  for (const t of breakdown) {
    assert.equal(flat.filter((r) => r.type === t.type).length, 1)
  }
  assert.deepEqual(
    columns.map((c) => c.length),
    [3, 2],
  )
})

test('breakdownColumns handles an empty breakdown', () => {
  assert.deepEqual(breakdownColumns([]), { max: 0, columns: [[], []] })
  assert.deepEqual(breakdownColumns(), { max: 0, columns: [[], []] })
})
