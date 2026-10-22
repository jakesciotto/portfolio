import { test } from 'node:test'
import assert from 'node:assert/strict'
import { settleLoaders } from './settle-loaders.mjs'

test('settleLoaders keeps every loader that returns data, stamped with one fetch time', async () => {
  const result = await settleLoaders(
    { a: async () => ({ n: 1 }), b: () => [2] },
    { now: () => 1000 },
  )
  assert.deepEqual(result, {
    a: { data: { n: 1 }, fetchedAt: 1000 },
    b: { data: [2], fetchedAt: 1000 },
  })
})

test('settleLoaders drops a loader that throws, rejects, returns null or times out', async () => {
  const errors = []
  const result = await settleLoaders(
    {
      ok: async () => 'kept',
      thrown: () => {
        throw new Error('sync')
      },
      rejected: async () => {
        throw new Error('async')
      },
      empty: async () => null,
      slow: () =>
        new Promise((resolve) => setTimeout(() => resolve('late'), 200)),
    },
    { timeoutMs: 20, now: () => 0, onError: (key) => errors.push(key) },
  )
  assert.deepEqual(Object.keys(result), ['ok'])
  assert.deepEqual(errors.sort(), ['rejected', 'slow', 'thrown'])
})
