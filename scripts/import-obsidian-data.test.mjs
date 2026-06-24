import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseContent, summarize, CANONICAL_TIERS } from './import-obsidian-data.mjs'

test('parseContent picks up checkbox lines that have a tier field', () => {
  const md = [
    '- [ ] open task [tier:: next]',
    '- [x] done task [tier:: now]',
    '- [-] cancelled [tier:: waiting]',
    '- [ ] no tier here',
    'plain paragraph [tier:: next]',
  ].join('\n')
  const tasks = parseContent(md)
  assert.equal(tasks.length, 3)
  assert.deepEqual(tasks[0], { marker: ' ', tier: 'next', dateISO: null })
  assert.equal(tasks[1].marker, 'x')
  assert.equal(tasks[2].marker, '-')
})

test('parseContent skips lines inside fenced code/dataview blocks', () => {
  const md = [
    '- [ ] real [tier:: backlog]',
    '```dataview',
    'TASK WHERE tier = "next"',
    '- [ ] example inside fence [tier:: now]',
    '```',
    '- [ ] real2 [tier:: someday]',
  ].join('\n')
  const tasks = parseContent(md)
  assert.equal(tasks.length, 2)
  assert.deepEqual(tasks.map((t) => t.tier), ['backlog', 'someday'])
})

test('parseContent extracts earliest of deadline/due date', () => {
  assert.equal(parseContent('- [ ] a [tier:: now] [deadline:: 2026-06-17]')[0].dateISO, '2026-06-17')
  assert.equal(parseContent('- [ ] a [tier:: now] [due:: 2026-07-01]')[0].dateISO, '2026-07-01')
  assert.equal(parseContent('- [ ] a [tier:: now]')[0].dateISO, null)
})

test('parseContent lowercases tier and accepts * bullets', () => {
  assert.equal(parseContent('* [/] x [tier:: NEXT]')[0].tier, 'next')
})

test('summarize counts active excluding x/X/- markers', () => {
  const tasks = [
    { marker: ' ', tier: 'next', dateISO: null },
    { marker: '/', tier: 'now', dateISO: null },
    { marker: 'x', tier: 'next', dateISO: null },
    { marker: 'X', tier: 'next', dateISO: null },
    { marker: '-', tier: 'next', dateISO: null },
  ]
  const r = summarize(tasks, '2026-06-24')
  assert.equal(r.active, 2)
  assert.equal(r.tiers.next, 1)
  assert.equal(r.tiers.now, 1)
})

test('summarize counts overdue among active only', () => {
  const tasks = [
    { marker: ' ', tier: 'next', dateISO: '2026-06-01' },
    { marker: ' ', tier: 'next', dateISO: '2026-12-01' },
    { marker: 'x', tier: 'next', dateISO: '2026-06-01' },
  ]
  const r = summarize(tasks, '2026-06-24')
  assert.equal(r.active, 2)
  assert.equal(r.overdue, 1)
})

test('summarize buckets non-canonical tiers under other', () => {
  const r = summarize([{ marker: ' ', tier: 'urgent', dateISO: null }], '2026-06-24')
  assert.equal(r.active, 1)
  assert.deepEqual(r.other, { urgent: 1 })
  for (const t of CANONICAL_TIERS) assert.equal(r.tiers[t], 0)
})
