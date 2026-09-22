import { collect, publish } from './jobs.mjs'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export async function serve({
  db,
  spotify,
  redis,
  notifier,
  intervalMs,
  log = console,
  once = false,
}) {
  log.log(`serve: collecting every ${Math.round(intervalMs / 60_000)} min`)
  for (;;) {
    try {
      const { inserted } = await collect({ db, spotify, log })
      if (inserted > 0) await publish({ db, redis, log })
      await notifier.success('collect')
    } catch (err) {
      db.recordRun('collect', false, 0, err.message)
      await notifier.failure('collect', err.message)
    }
    if (once) return
    await sleep(intervalMs)
  }
}
