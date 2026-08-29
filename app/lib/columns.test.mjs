import { test } from 'node:test'
import assert from 'node:assert/strict'
import { layoutColumns } from './columns.mjs'

const years = [
  { label: "'24", value: 1640.4, text: '2024 · 1,640h' },
  { label: "'25", value: 1826.8, text: '2025 · 1,827h' },
  { label: "'26", value: 286.8, text: '2026 (to feb) · 287h', partial: true },
]

test('layoutColumns scales to the max and marks the peak', () => {
  const out = layoutColumns(years)
  assert.equal(out[1].peak, true)
  assert.equal(out[1].heightPct, 100)
  assert.equal(out[1].opacity, 1)
  assert.equal(out[0].peak, false)
  assert.equal(out[0].opacity, 0.82)
  assert.equal(Math.round(out[0].heightPct), 90)
})

test('layoutColumns dims partial bars and honors dim', () => {
  const out = layoutColumns(years, { dim: 0.45 })
  assert.equal(out[2].partial, true)
  assert.equal(out[2].opacity, 0.3)
  assert.equal(out[0].opacity, 0.45)
})

test('layoutColumns renders zero as a stub and enforces a 3% floor', () => {
  const out = layoutColumns([
    { label: 'S', value: 0, text: '0' },
    { label: 'M', value: 10, text: '10' },
    { label: 'T', value: 1000, text: '1000' },
  ])
  assert.equal(out[0].zero, true)
  assert.equal(out[0].heightPct, 0)
  assert.equal(out[1].heightPct, 3)
  assert.equal(out[2].peak, true)
})

test('layoutColumns with all zeros has no peak', () => {
  const out = layoutColumns([{ label: 'a', value: 0, text: '0' }])
  assert.equal(out[0].peak, false)
  assert.equal(out[0].zero, true)
})
