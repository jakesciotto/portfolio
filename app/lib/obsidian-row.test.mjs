import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TIERS, tierCards } from './obsidian-row.mjs'

const live = {
  active: 139,
  overdue: 26,
  tiers: { now: 20, next: 34, waiting: 18, blocked: 0, someday: 19, backlog: 48 },
}

test('TIERS run hot to cold with one hue each', () => {
  assert.deepEqual(
    TIERS.map((t) => t.key),
    ['now', 'next', 'waiting', 'blocked', 'someday', 'backlog'],
  )
  assert.deepEqual(
    TIERS.map((t) => t.accent),
    ['secondary', 'primary', 'amber', 'red', 'violet', 'tertiary'],
  )
})

test('tierCards computes share and pct against active', () => {
  const cards = tierCards(live)
  assert.equal(cards[0].count, 20)
  assert.equal(cards[0].pct, 14)
  assert.equal(cards[5].pct, 35)
  assert.equal(cards[3].zero, true)
  assert.equal(cards[3].pct, 0)
})

test('tierCards guards missing data and a zero total', () => {
  const empty = tierCards(null)
  assert.equal(empty.length, 6)
  assert.ok(empty.every((c) => c.count === 0 && c.pct === 0 && c.zero))
  const zeroActive = tierCards({ active: 0, tiers: { now: 3 } })
  assert.equal(zeroActive[0].count, 3)
  assert.equal(zeroActive[0].pct, 0)
})
