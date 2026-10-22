import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createAnalytics, QUEUE_LIMIT } from './analytics.mjs'

function fakeClient() {
  const sent = []
  return {
    sent,
    capture: (event, properties) => sent.push([event, properties]),
  }
}

test('analytics queues events before posthog loads and flushes them in order on attach', () => {
  const analytics = createAnalytics()
  analytics.capture('first', { a: 1 })
  analytics.capture('second')
  const client = fakeClient()
  analytics.attach(client)
  assert.deepEqual(client.sent, [
    ['first', { a: 1 }],
    ['second', undefined],
  ])
  assert.equal(analytics.pending(), 0)
})

test('analytics sends events straight to posthog after attach', () => {
  const analytics = createAnalytics()
  const client = fakeClient()
  analytics.attach(client)
  analytics.capture('later', { b: 2 })
  assert.deepEqual(client.sent, [['later', { b: 2 }]])
})

test('analytics drops events past the queue limit when posthog never loads', () => {
  const analytics = createAnalytics()
  for (let i = 0; i < QUEUE_LIMIT + 10; i++) analytics.capture(`e${i}`)
  assert.equal(analytics.pending(), QUEUE_LIMIT)
})
