import { test } from 'node:test'
import assert from 'node:assert/strict'
import { classify, aggregate } from './import-strava-data.mjs'

function activity(name, sportType, startLocal = '2026-06-01T10:00:00', movingTime = 3600, distance = 0) {
  return {
    id: String(Math.floor(Math.random() * 1e9)),
    name,
    sport_type: sportType,
    start_local: startLocal,
    summary: { distance, moving_time: movingTime },
  }
}

test('classify: BJJ name overrides Workout sport_type', () => {
  assert.equal(classify(activity('coaching BJJ', 'Workout')), 'BJJ')
})

test('classify: jiu-jitsu variants land in BJJ', () => {
  assert.equal(classify(activity('jiu jitsu fundamentals', 'Workout')), 'BJJ')
  assert.equal(classify(activity('Jiu-Jitsu open mat', 'Workout')), 'BJJ')
  assert.equal(classify(activity('grappling rounds', 'Workout')), 'BJJ')
})

test('classify: muay thai variants land in Muay Thai', () => {
  assert.equal(classify(activity('muay thai', 'Workout')), 'Muay Thai')
  assert.equal(classify(activity('mt', 'Workout')), 'Muay Thai')
  assert.equal(classify(activity('muay thai & sparring', 'Workout')), 'Muay Thai')
})

test('classify: standalone sparring classifies as Muay Thai', () => {
  assert.equal(classify(activity('sparring rounds', 'Workout')), 'Muay Thai')
})

test('classify: name rules override mislogged WeightTraining', () => {
  assert.equal(
    classify(activity('muay thai teep defense & coaching bjj fundamentals', 'WeightTraining')),
    'Muay Thai',
  )
})

test('classify: earliest mention wins for combined sessions', () => {
  assert.equal(classify(activity('bjj then muay thai', 'Workout')), 'BJJ')
  assert.equal(classify(activity('muay thai then bjj', 'Workout')), 'Muay Thai')
})

test('classify: mt does not match inside other words', () => {
  assert.equal(classify(activity('Mtn repeats', 'Run')), 'Run')
})

test('classify: plain WeightTraining stays Weights', () => {
  assert.equal(classify(activity('Evening Weight Training', 'WeightTraining')), 'Weights')
})

test('classify: non-Workout sport types use TYPE_LABELS / camelCase split', () => {
  assert.equal(classify(activity('Morning Tennis', 'Tennis')), 'Tennis')
  assert.equal(classify(activity('hill ride', 'MountainBikeRide')), 'MTB')
  assert.equal(classify(activity('paddle', 'StandUpPaddling')), 'SUP')
})

test('classify: Workout with workout keywords refines', () => {
  assert.equal(classify(activity('yoga flow', 'Workout')), 'Yoga')
  assert.equal(classify(activity('HIIT intervals', 'Workout')), 'HIIT')
})

test('classify: BJJ gym vocabulary on Workout-typed activities lands in BJJ', () => {
  assert.equal(classify(activity('open mat', 'Workout')), 'BJJ')
  assert.equal(classify(activity('Randori', 'Workout')), 'BJJ')
  assert.equal(classify(activity('coaching and training', 'Workout')), 'BJJ')
  assert.equal(classify(activity('2 hours coaching 90 min training (nogi)', 'Workout')), 'BJJ')
  assert.equal(classify(activity('advanced gi', 'Workout')), 'BJJ')
  assert.equal(classify(activity('comp class', 'Workout')), 'BJJ')
  assert.equal(classify(activity('6 am class', 'Workout')), 'BJJ')
  assert.equal(classify(activity('morning rolls in cape cod', 'Workout')), 'BJJ')
  assert.equal(classify(activity('coaches training / drilling', 'Workout')), 'BJJ')
  assert.equal(classify(activity('wrestling @ tiger style mma', 'Workout')), 'BJJ')
  assert.equal(classify(activity('fundies / kickboxing', 'Workout')), 'BJJ')
})

test('classify: BJJ gym vocabulary does NOT apply outside Workout sport_type', () => {
  assert.equal(classify(activity('Quick 5K before coaching', 'Run')), 'Run')
  assert.equal(classify(activity('working on becoming a menace on the mats', 'WeightTraining')), 'Weights')
})

test('classify: gym-vocab earliest mention still loses to earlier strong keyword', () => {
  assert.equal(classify(activity('kickboxing and coaching', 'Workout')), 'Muay Thai')
  assert.equal(classify(activity('coaching and kickboxing', 'Workout')), 'BJJ')
})

test('classify: sport name keywords refine generic Workouts', () => {
  assert.equal(classify(activity('Box Lacrosse', 'Workout')), 'Lacrosse')
  assert.equal(classify(activity('tennis', 'Workout')), 'Tennis')
  assert.equal(classify(activity('stairs and sauna', 'Workout')), 'Stairs')
  assert.equal(classify(activity('sauna', 'Workout')), 'Sauna')
})

test('classify: unmatched Workout stays Workout', () => {
  assert.equal(classify(activity('Afternoon Workout', 'Workout')), 'Workout')
})

test('aggregate: periods bucket by start_local against injected now', () => {
  const now = new Date('2026-06-09T12:00:00')
  const activities = [
    activity('muay thai', 'Workout', '2026-06-08T17:00:00', 3600), // within 7d
    activity('coaching BJJ', 'Workout', '2026-05-20T17:00:00', 7200), // within 30d only
    activity('Morning Run', 'Run', '2026-01-15T08:00:00', 1800, 5000), // ytd only
    activity('Old Ride', 'Ride', '2025-03-01T08:00:00', 5400, 20000), // all only
  ]
  const result = aggregate(activities, now)

  assert.equal(result.week.count, 1)
  assert.equal(result.month.count, 2)
  assert.equal(result.year.count, 3)
  assert.equal(result.all.count, 4)

  assert.equal(result.week.movingTime, 3600)
  assert.equal(result.month.movingTime, 10800)

  assert.equal(result.all.period, 'all')
  assert.equal(result.week.period, 'week')
})

test('aggregate: breakdown sums per bucket and sorts by count desc', () => {
  const now = new Date('2026-06-09T12:00:00')
  const activities = [
    activity('muay thai', 'Workout', '2026-06-01T17:00:00', 3600),
    activity('mt sparring', 'Workout', '2026-06-02T17:00:00', 3600),
    activity('coaching bjj', 'Workout', '2026-06-03T17:00:00', 7200),
    activity('lift', 'WeightTraining', '2026-06-04T17:00:00', 3000),
  ]
  const { month } = aggregate(activities, now)

  assert.deepEqual(
    month.breakdown.map((b) => b.type),
    ['Muay Thai', 'BJJ', 'Weights'],
  )
  const muayThai = month.breakdown[0]
  assert.equal(muayThai.count, 2)
  assert.equal(muayThai.movingTime, 7200)
})

test('aggregate: distance converts meters to miles with 1 decimal', () => {
  const now = new Date('2026-06-09T12:00:00')
  const activities = [activity('Morning Run', 'Run', '2026-06-01T08:00:00', 1800, 8046.7)]
  const { month } = aggregate(activities, now)
  assert.equal(month.distance, 5)
  assert.equal(month.breakdown[0].distance, 5)
})
