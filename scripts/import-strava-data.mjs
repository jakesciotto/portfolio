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
  { pattern: /muay.?thai|kickbox/i, label: 'Muay Thai' },
]

// Gym vocabulary that means BJJ in this athlete's logs, but only when Strava
// already bucketed the session as a generic Workout -- a Run named "5K before
// coaching" must stay a Run.
const WORKOUT_NAME_RULES = [
  {
    pattern:
      /randori|open mat|\brolls\b|\brolling\b|no.?gi|\bgi\b|comp class|coach|drilling|fundies|fundamentals|wrestl|\btraining\b|\bclass\b/i,
    label: 'BJJ',
  },
  // Ambiguous outside the gym: "mt" collides with mountain abbreviations on
  // runs/hikes, "sparring" could ride along anywhere.
  { pattern: /\bmt\b|sparring/i, label: 'Muay Thai' },
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
  { pattern: /lacrosse/i, label: 'Lacrosse' },
  { pattern: /tennis/i, label: 'Tennis' },
  { pattern: /\bstairs?\b|stairmaster/i, label: 'Stairs' },
  { pattern: /\bsauna\b/i, label: 'Sauna' },
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

function martialBucket(name, rules) {
  let best = null
  for (const { pattern, label } of rules) {
    const m = name.match(pattern)
    if (m && (best === null || m.index < best.index)) {
      best = { index: m.index, label }
    }
  }
  return best ? best.label : null
}

export function classify(activity) {
  const name = activity.name || ''
  const raw = activity.sport_type || activity.type || 'Other'
  const isWorkout = raw === 'Workout'

  const rules = isWorkout ? [...NAME_RULES, ...WORKOUT_NAME_RULES] : NAME_RULES
  const martial = martialBucket(name, rules)
  if (martial) return martial

  if (isWorkout) {
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

// Maps a raw Strava API v3 activity to the shape `aggregate` consumes. Keeps the
// API front-end decoupled from the classification/aggregation logic so the MCP
// dump format and the API format converge on one schema.
export function mapApiActivity(a) {
  return {
    name: a.name || '',
    sport_type: a.sport_type || a.type || 'Other',
    start_local: a.start_date_local || a.start_date,
    summary: {
      distance: a.distance ?? 0,
      moving_time: a.moving_time ?? 0,
    },
  }
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

// Exchanges the stored refresh token for a fresh access token. Strava rotates
// refresh tokens, so the new one is persisted back to Redis (preferred over the
// env value on the next run) -- same token-persistence pattern the Oura/Todoist
// routes use.
async function refreshAccessToken(redis) {
  const clientId = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_SECRET
  const stored = redis ? await redis.get('strava:refresh_token').catch(() => null) : null
  const refreshToken = stored || process.env.STRAVA_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Strava creds (STRAVA_CLIENT_ID, STRAVA_SECRET, STRAVA_REFRESH_TOKEN).')
  }
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Strava token refresh failed (${res.status}): ${JSON.stringify(data)}`)
  }
  if (redis && data.refresh_token) {
    await redis.set('strava:refresh_token', data.refresh_token).catch(() => {})
  }
  return data.access_token
}

async function fetchAllActivities(token) {
  const all = []
  let page = 1
  for (;;) {
    const url = new URL('https://www.strava.com/api/v3/athlete/activities')
    url.searchParams.set('per_page', '200')
    url.searchParams.set('page', String(page))
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
    if (res.status === 401) {
      throw new Error(
        'Strava activities fetch returned 401. The refresh token lacks the ' +
          'activity:read_all scope -- re-authorize the app with that scope and ' +
          'update STRAVA_REFRESH_TOKEN (see .claude/plans/2026-06-24-obsidian-task-tile-plan.md).',
      )
    }
    if (!res.ok) throw new Error(`Strava activities fetch failed (${res.status})`)
    const batch = await res.json()
    if (!Array.isArray(batch) || batch.length === 0) break
    all.push(...batch.map(mapApiActivity))
    page++
  }
  return all
}

async function main() {
  const redisUrl = process.env.KV_REST_API_URL
  const redisToken = process.env.KV_REST_API_TOKEN

  if (!redisUrl || !redisToken) {
    console.error('Missing env vars: KV_REST_API_URL and KV_REST_API_TOKEN must be set.')
    process.exit(1)
  }

  const redis = new Redis({ url: redisUrl, token: redisToken })

  // Dump-file mode (manual fallback) when a path arg is given; otherwise fetch
  // live from the Strava API (the mode launchd uses).
  const dumpArg = process.argv[2]
  let activities
  if (dumpArg) {
    try {
      activities = JSON.parse(await readFile(dumpArg, 'utf8'))
    } catch (err) {
      console.error(`Cannot read dump at ${dumpArg}: ${err.message}`)
      process.exit(1)
    }
    if (!Array.isArray(activities) || activities.length === 0) {
      console.error('Dump is empty or not a JSON array. Aborting.')
      process.exit(1)
    }
    console.log(`Read ${activities.length} activities from ${dumpArg}`)
  } else {
    console.log('Fetching activities from Strava API...')
    const token = await refreshAccessToken(redis)
    activities = await fetchAllActivities(token)
    console.log(`Fetched ${activities.length} activities from Strava API`)
    if (activities.length === 0) {
      console.error('No activities returned. Aborting (keeping existing snapshot).')
      process.exit(1)
    }
  }

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
