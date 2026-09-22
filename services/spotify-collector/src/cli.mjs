import { openDb } from './db.mjs'
import { createRedis } from './redis.mjs'
import { createSpotify } from './spotify.mjs'
import { createNotifier } from './notify.mjs'
import { collect, publish } from './jobs.mjs'
import { importArchive } from './import-archive.mjs'
import { serve } from './serve.mjs'

const env = process.env
const [command, arg] = process.argv.slice(2)
const db = openDb(env.SPOTIFY_DB_PATH || './data/plays.db')

function redis() {
  return createRedis({ url: env.KV_REST_API_URL, token: env.KV_REST_API_TOKEN })
}
function spotify(r) {
  return createSpotify({
    clientId: env.SPOTIFY_CLIENT_ID,
    clientSecret: env.SPOTIFY_CLIENT_SECRET,
    refreshToken: env.SPOTIFY_LIVE_REFRESH_TOKEN,
    redis: r,
  })
}

try {
  switch (command) {
    case 'serve': {
      const r = redis()
      await serve({
        db,
        spotify: spotify(r),
        redis: r,
        notifier: createNotifier({ topic: env.NTFY_TOPIC }),
        intervalMs: Number(env.COLLECT_INTERVAL_MINUTES || 15) * 60_000,
      })
      break
    }
    case 'collect': {
      await collect({ db, spotify: spotify(redis()) })
      break
    }
    case 'publish': {
      await publish({ db, redis: redis(), force: arg === '--force' })
      break
    }
    case 'import': {
      if (!arg)
        throw new Error(
          'usage: import <folder-with-Streaming_History_Audio_*.json>',
        )
      await importArchive({ db, folder: arg })
      break
    }
    case 'status': {
      console.table(db.counts())
      for (const kind of ['collect', 'publish', 'import']) {
        const run = db.lastRun(kind)
        if (run)
          console.log(
            `${kind}: ${run.ok ? 'ok' : 'FAILED'} at ${run.at} (${run.detail})`,
          )
      }
      break
    }
    default:
      throw new Error(
        'usage: cli.mjs serve|collect|publish [--force]|import <folder>|status',
      )
  }
} catch (err) {
  console.error(err.message)
  process.exitCode = 1
} finally {
  db.close()
}
