import { test } from 'node:test'
import assert from 'node:assert/strict'
import { newerEntry, responseTime } from './snapshot-time.mjs'

const answer = (date) => ({
  headers: new Headers(date ? { date } : {}),
})

test('newerEntry never replaces a dated snapshot with an older or undated one', () => {
  const shown = { value: 180, at: 2000 }

  assert.equal(newerEntry(shown, { value: 138, at: 1000 }), shown)
  assert.equal(newerEntry(shown, { value: 138, at: null }), shown)

  const equal = { value: 181, at: 2000 }
  assert.equal(newerEntry(shown, equal), equal)

  const newer = { value: 187, at: 3000 }
  assert.equal(newerEntry(shown, newer), newer)

  const dated = { value: 138, at: 1000 }
  assert.equal(newerEntry({ value: 180, at: null }, dated), dated)
  assert.equal(newerEntry(null, dated), dated)
})

test('responseTime takes the oldest Date header and falls back to the clock', () => {
  const clock = () => 42

  assert.equal(
    responseTime(
      [
        answer('Thu, 05 Nov 2026 14:42:21 GMT'),
        answer('Wed, 04 Nov 2026 00:43:05 GMT'),
      ],
      clock,
    ),
    Date.parse('Wed, 04 Nov 2026 00:43:05 GMT'),
  )
  assert.equal(
    responseTime(
      [answer(null), answer('Thu, 05 Nov 2026 14:42:21 GMT')],
      clock,
    ),
    Date.parse('Thu, 05 Nov 2026 14:42:21 GMT'),
  )
  assert.equal(responseTime([answer(null)], clock), 42)
  assert.equal(responseTime([], clock), 42)
})
