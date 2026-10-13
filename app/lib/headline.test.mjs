import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { HEADLINE } from './accents.mjs'

const dir = new URL('../components/', import.meta.url)
const RAW_LARGE = /\btext-(?:[2-9]xl|\[(?:2[4-9]|[3-9]\d)px\])/g

test('every data tile headline takes its size from HEADLINE', () => {
  assert.match(HEADLINE, /text-\[40px\]/)
  const tiles = readdirSync(dir).filter(
    (f) => f.endsWith('-tile.jsx') || f === 'obsidian-row.jsx',
  )
  assert.ok(tiles.length > 5)
  for (const file of tiles) {
    const raw = readFileSync(new URL(file, dir), 'utf8').match(RAW_LARGE)
    assert.equal(raw, null, `${file} sets a raw headline size: ${raw}`)
  }
})
