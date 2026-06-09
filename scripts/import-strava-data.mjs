/**
 * import-strava-data.mjs
 *
 * Reads a JSON dump of Strava activities (pulled via the Strava MCP in a
 * Claude session), classifies and aggregates them per period, and writes
 * Redis keys consumed by /api/strava-stats.
 *
 * Usage:
 *   node scripts/import-strava-data.mjs [path-to-dump.json]
 *   (default dump path: scripts/strava-activities.json)
 *
 * Env vars required:
 *   KV_REST_API_URL   - Upstash Redis REST URL
 *   KV_REST_API_TOKEN - Upstash Redis REST token
 *
 * Dump shape: flat JSON array of MCP activities:
 *   { id, name, sport_type, start_local, summary: { distance, moving_time } }
 */

import { Redis } from '@upstash/redis'
import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

// Martial-arts rules run first regardless of sport_type. Earliest keyword
// mention in the name wins; ties go to BJJ (listed first).
const NAME_RULES = [
  { pattern: /bjj|jiu.?jitsu|grappl/i, label: 'BJJ' },
  { pattern: /muay.?thai|\bmt\b|kickbox|sparring/i, label: 'Muay Thai' },
]

// Strava forces non-enum activity types (e.g. Garmin-synced strength/yoga)
// into the generic "Workout" bucket. Infer a finer label from the name.
const WORKOUT_KEYWORDS = [
  { pattern: /\b(hiit|tabata|interval|amrap|emom)\b/i, label: 'HIIT' },
  { pattern: /\b(crossfit|wod)\b/i, label: 'CrossFit' },
  { pattern: /\b(yoga|vinyasa|hatha)\b/i, label: 'Yoga' },
  { pattern: /\b(pilates|reformer)\b/i, label: 'Pilates' },
  { pattern: /\b(mobility|stretch|recovery|foam roll)\b/i, label: 'Mobility' },
  { pattern: /\b(spin|peloton)\b/i, label: 'Spin' },
  { pattern: /\b(row(ing)?|erg)\b/i, label: 'Rowing' },
  {
    pattern:
      /\b(strength|lifting|lift|push|pull|legs?|upper|lower|chest|back|squat|deadlift|bench)\b/i,
    label: 'Strength',
  },
  { pattern: /\b(cardio|conditioning)\b/i, label: 'Cardio' },
  { pattern: /\b(bodyweight|calisthenics)\b/i, label: 'Bodyweight' },
]

const TYPE_LABELS = {
  WeightTraining: 'Weights',
  VirtualRide: 'Virtual Ride',
  VirtualRun: 'Virtual Run',
  TrailRun: 'Trail Run',
  MountainBikeRide: 'MTB',
  GravelRide: 'Gravel Ride',
  EBikeRide: 'E-Bike',
  StairStepper: 'Stairs',
  RockClimbing: 'Climbing',
  NordicSki: 'Nordic Ski',
  AlpineSki: 'Alpine Ski',
  BackcountrySki: 'Backcountry',
  IceSkate: 'Ice Skate',
  InlineSkate: 'Inline Skate',
  StandUpPaddling: 'SUP',
}

function displayType(raw) {
  if (TYPE_LABELS[raw]) return TYPE_LABELS[raw]
  return raw.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function martialBucket(name) {
  let best = null
  for (const { pattern, label } of NAME_RULES) {
    const m = name.match(pattern)
    if (m && (best === null || m.index < best.index)) {
      best = { index: m.index, label }
    }
  }
  return best ? best.label : null
}

export function classify(activity) {
  const name = activity.name || ''
  const martial = martialBucket(name)
  if (martial) return martial

  const raw = activity.sport_type || activity.type || 'Other'
  if (raw === 'Workout') {
    for (const { pattern, label } of WORKOUT_KEYWORDS) {
      if (pattern.test(name)) return label
    }
    return 'Workout'
  }
  return displayType(raw)
}

function metersToMiles(m) {
  return +(m * 0.000621371).toFixed(1)
}

const PERIOD_FILTERS = {
  week: (date, now) => date >= new Date(now.getTime() - 7 * 86400000),
  month: (date, now) => date >= new Date(now.getTime() - 30 * 86400000),
  year: (date, now) => date >= new Date(now.getFullYear(), 0, 1),
  all: () => true,
}

function aggregatePeriod(activities, period) {
  let totalDistance = 0
  let totalMovingTime = 0
  const byType = {}

  for (const a of activities) {
    const type = classify(a)
    const distance = a.summary?.distance ?? a.distance ?? 0
    const movingTime = a.summary?.moving_time ?? a.moving_time ?? 0

    totalDistance += distance
    totalMovingTime += movingTime

    if (!byType[type]) {
      byType[type] = { count: 0, distance: 0, movingTime: 0 }
    }
    byType[type].count++
    byType[type].distance += distance
    byType[type].movingTime += movingTime
  }

  const breakdown = Object.entries(byType)
    .map(([type, data]) => ({
      type,
      count: data.count,
      distance: metersToMiles(data.distance),
      movingTime: data.movingTime,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    distance: metersToMiles(totalDistance),
    count: activities.length,
    movingTime: totalMovingTime,
    breakdown,
    period,
  }
}

export function aggregate(activities, now = new Date()) {
  const result = {}
  for (const [period, includes] of Object.entries(PERIOD_FILTERS)) {
    const filtered = activities.filter((a) =>
      includes(new Date(a.start_local), now),
    )
    result[period] = aggregatePeriod(filtered, period)
  }
  return result
}

async function main() {
  const dumpPath = process.argv[2] || 'scripts/strava-activities.json'

  const redisUrl = process.env.KV_REST_API_URL
  const redisToken = process.env.KV_REST_API_TOKEN

  if (!redisUrl || !redisToken) {
    console.error('Missing env vars: KV_REST_API_URL and KV_REST_API_TOKEN must be set.')
    process.exit(1)
  }

  let activities
  try {
    activities = JSON.parse(await readFile(dumpPath, 'utf8'))
  } catch (err) {
    console.error(`Cannot read dump at ${dumpPath}: ${err.message}`)
    process.exit(1)
  }

  if (!Array.isArray(activities) || activities.length === 0) {
    console.error('Dump is empty or not a JSON array. Aborting.')
    process.exit(1)
  }

  console.log(`Read ${activities.length} activities from ${dumpPath}`)

  const unclassified = activities.filter(
    (a) => (a.sport_type || a.type) === 'Workout' && classify(a) === 'Workout',
  )
  if (unclassified.length > 0) {
    console.log(`\nWorkout-typed activities left unclassified (${unclassified.length}):`)
    for (const a of unclassified) {
      console.log(`  ${a.start_local}  "${a.name}"`)
    }
  }

  const results = aggregate(activities)

  const redis = new Redis({ url: redisUrl, token: redisToken })

  console.log('\nWriting to Redis...')
  for (const [period, value] of Object.entries(results)) {
    await redis.set(`strava:stats:${period}`, JSON.stringify(value))
    console.log(`  SET strava:stats:${period}`)
  }
  const lastSync = new Date().toISOString()
  await redis.set('strava:last_sync', lastSync)
  console.log(`  SET strava:last_sync = ${lastSync}`)

  const orphans = [
    'strava_refresh_token',
    'strava_stats:week',
    'strava_stats:month',
    'strava_stats:year',
    'strava_stats:all',
  ]
  const deleted = await redis.del(...orphans)
  console.log(`  DEL ${orphans.length} legacy keys (${deleted} existed)`)

  console.log('\n--- Summary ---')
  for (const [period, r] of Object.entries(results)) {
    const top = r.breakdown
      .slice(0, 3)
      .map((b) => `${b.type} x${b.count}`)
      .join(', ')
    console.log(
      `${period.padEnd(6)} ${String(r.count).padStart(4)} activities, ${Math.floor(
        r.movingTime / 3600,
      )} hrs, ${r.distance} mi  [${top}]`,
    )
  }
  console.log('\nDone.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
