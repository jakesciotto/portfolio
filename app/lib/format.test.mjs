import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  agoLabel,
  compact,
  hoursToDays,
  pct,
  monthYear,
  weekdayShort,
  shortDuration,
} from './format.mjs'

const NOW = Date.parse('2026-08-29T16:00:00Z')

test('agoLabel formats hours, days, and just now', () => {
  assert.equal(agoLabel('2026-08-29T13:02:22Z', 'synced', NOW), 'synced 2h ago')
  assert.equal(agoLabel('2026-08-29T15:30:00Z', '', NOW), 'just now')
  assert.equal(agoLabel('2026-08-26T10:00:00Z', 'synced', NOW), 'synced 3d ago')
  assert.equal(agoLabel(null, 'synced', NOW), null)
  assert.equal(agoLabel('not a date', 'synced', NOW), null)
})

test('compact shortens large numbers and keeps small ones', () => {
  assert.equal(compact(391430), '391k')
  assert.equal(compact(41631), '41.6k')
  assert.equal(compact(9436), '9,436')
  assert.equal(compact(10000), '10k')
  assert.equal(compact(1250000), '1.3m')
  assert.equal(compact(null), '---')
})

test('hoursToDays rounds to whole days', () => {
  assert.equal(hoursToDays(2279), 95)
  assert.equal(hoursToDays(0), 0)
})

test('pct rounds and guards a zero total', () => {
  assert.equal(pct(20, 139), 14)
  assert.equal(pct(48, 139), 35)
  assert.equal(pct(5, 0), 0)
})

test('monthYear and weekdayShort use UTC', () => {
  assert.equal(monthYear('2015-09-06T00:24:17Z'), 'sep 2015')
  assert.equal(monthYear('2026-02-19T23:54:02Z'), 'feb 2026')
  assert.equal(monthYear(null), null)
  assert.equal(weekdayShort('2026-08-28'), 'fri')
  assert.equal(weekdayShort('2026-08-23'), 'sun')
})

test('shortDuration condenses WakaTime text', () => {
  assert.equal(shortDuration('18 hrs 54 mins'), '18h 54m')
  assert.equal(shortDuration('1 hr 39 mins'), '1h 39m')
  assert.equal(shortDuration('53 mins'), '53m')
  assert.equal(shortDuration('10 hrs'), '10h')
  assert.equal(shortDuration('0 secs'), '0')
  assert.equal(shortDuration(null), '---')
})
