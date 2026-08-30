'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import { agoLabel } from '../lib/format.mjs'
import { LABEL } from '../lib/accents.mjs'
import TileSkeleton from './tile-skeleton'

function Run({ items, ariaHidden }) {
  return (
    <span className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {items.map((it, i) => (
        <span key={`${it.playedAt}-${i}`} className="flex items-center whitespace-nowrap pr-10 text-sm">
          <span className="mr-4 inline-block h-1 w-1 rounded-full bg-accent-tertiary" />
          <span className="font-medium text-foreground">{it.track}</span>
          <span className="ml-2 text-muted-foreground">{it.artist}</span>
        </span>
      ))}
    </span>
  )
}

export default function SpotifyRecentTile() {
  const data = useCachedFetch('/api/spotify-recent', 'spotify_recent', {
    ttl: 120000,
    shouldCache: (d) => d.items?.length > 0,
  })

  if (!data) return <TileSkeleton accent="tertiary" lines={1} />

  const items = data.items || []
  if (!items.length) return null

  const seconds = Math.max(30, items.length * 3.5)

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono text-lg font-semibold tracking-tight text-foreground">spotify</h3>
        <span className={LABEL}>
          last {items.length} plays{items[0]?.playedAt && ` · latest ${agoLabel(items[0].playedAt)}`}
        </span>
      </div>
      <div className="ticker -mx-6 overflow-hidden max-md:-mx-5">
        <div className="ticker-track flex w-max" style={{ animationDuration: `${seconds}s` }}>
          <Run items={items} />
          <Run items={items} ariaHidden />
        </div>
      </div>
    </div>
  )
}
