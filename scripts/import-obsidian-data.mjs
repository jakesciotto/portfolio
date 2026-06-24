/**
 * import-obsidian-data.mjs
 *
 * Reads the Obsidian vault markdown, counts Dataview inline-field tasks
 * (`[tier:: ...]` checkboxes) per tier, and writes Redis keys consumed by
 * /api/obsidian-stats.
 *
 * Usage:   node scripts/import-obsidian-data.mjs
 * Env:     KV_REST_API_URL, KV_REST_API_TOKEN  (required)
 *          OBSIDIAN_VAULT_PATH                  (optional; defaults to
 *                                                ~/Documents/Obsidian Vault)
 *
 * A line is a task iff it is a checkbox AND carries a [tier:: ...] field.
 * Active = marker not in {x, X, -}. Scope = areas/** and projects/** only.
 * Lines inside fenced code blocks (```...```) are skipped so embedded
 * Dataview query examples are not counted.
 */

import { Redis } from '@upstash/redis'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { pathToFileURL } from 'node:url'

export const CANONICAL_TIERS = ['now', 'next', 'waiting', 'blocked', 'someday', 'backlog']

const CHECKBOX = /^\s*[-*]\s*\[(.)\]\s/
const TIER = /\[tier::\s*([^\]]+?)\s*\]/i
const DATE = /\[(?:deadline|due)::\s*(\d{4}-\d{2}-\d{2})\s*\]/i

export function parseContent(text) {
  const tasks = []
  let inFence = false
  for (const line of text.split('\n')) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const cb = line.match(CHECKBOX)
    if (!cb) continue
    const tier = line.match(TIER)
    if (!tier) continue
    const date = line.match(DATE)
    tasks.push({
      marker: cb[1],
      tier: tier[1].toLowerCase(),
      dateISO: date ? date[1] : null,
    })
  }
  return tasks
}

export function summarize(tasks, today) {
  const tiers = Object.fromEntries(CANONICAL_TIERS.map((t) => [t, 0]))
  const other = {}
  let active = 0
  let overdue = 0
  for (const t of tasks) {
    if (t.marker === 'x' || t.marker === 'X' || t.marker === '-') continue
    active++
    if (CANONICAL_TIERS.includes(t.tier)) tiers[t.tier]++
    else other[t.tier] = (other[t.tier] || 0) + 1
    if (t.dateISO && t.dateISO < today) overdue++
  }
  return { active, overdue, tiers, other }
}

async function collectMarkdown(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await collectMarkdown(full)))
    else if (e.isFile() && e.name.endsWith('.md')) out.push(full)
  }
  return out
}

function localToday(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`
}

async function main() {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) {
    console.error('Missing env vars: KV_REST_API_URL and KV_REST_API_TOKEN must be set.')
    process.exit(1)
  }

  const vault =
    process.env.OBSIDIAN_VAULT_PATH || join(homedir(), 'Documents', 'Obsidian Vault')

  const files = [
    ...(await collectMarkdown(join(vault, 'areas'))),
    ...(await collectMarkdown(join(vault, 'projects'))),
  ]
  if (files.length === 0) {
    console.error(`No markdown found under ${vault}/{areas,projects}. Check OBSIDIAN_VAULT_PATH.`)
    process.exit(1)
  }

  const tasks = []
  for (const f of files) {
    tasks.push(...parseContent(await readFile(f, 'utf8')))
  }

  const today = localToday()
  const { active, overdue, tiers, other } = summarize(tasks, today)

  const result = { active, overdue, tiers }

  const redis = new Redis({ url, token })
  await redis.set('obsidian:stats', JSON.stringify(result))
  const lastSync = new Date().toISOString()
  await redis.set('obsidian:last_sync', lastSync)

  console.log(`Scanned ${files.length} files.`)
  console.log(`active ${active}  overdue ${overdue}`)
  for (const t of CANONICAL_TIERS) console.log(`  ${t.padEnd(8)} ${tiers[t]}`)
  if (Object.keys(other).length) console.log('  OTHER tiers (not displayed):', other)
  console.log(`SET obsidian:last_sync = ${lastSync}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
