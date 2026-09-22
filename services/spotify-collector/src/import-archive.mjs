import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fromArchive } from './plays.mjs'

export async function importArchive({ db, folder, log = console }) {
  const files = (await readdir(folder))
    .filter(
      (f) => f.startsWith('Streaming_History_Audio_') && f.endsWith('.json'),
    )
    .sort()
  if (!files.length)
    throw new Error(`No Streaming_History_Audio_*.json files in ${folder}`)

  let read = 0
  let inserted = 0
  for (const file of files) {
    const entries = JSON.parse(await readFile(join(folder, file), 'utf8'))
    const plays = entries.filter((e) => e.ts).map(fromArchive)
    const n = db.insertPlays(plays)
    read += entries.length
    inserted += n
    log.log(`  ${file}: ${entries.length} read, ${n} new`)
  }
  db.recordRun(
    'import',
    true,
    inserted,
    `read ${read} from ${files.length} files`,
  )
  log.log(
    `import: ${read} read, ${inserted} new, ${read - inserted} already present`,
  )
  return { read, inserted }
}
