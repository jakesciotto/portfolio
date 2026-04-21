'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import TileSkeleton from './tile-skeleton'

export default function TraktTile() {
  const stats = useCachedFetch('/api/trakt-stats', 'trakt_stats', {
    ttl: 120000,
    shouldCache: (data) => data.nowWatching !== undefined,
  })

  if (!stats) return <TileSkeleton accent="tertiary" />

  const nowWatching = stats.nowWatching
  const lastWatched = stats.lastWatched
  const allTime = stats.stats

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-1">
        trakt
      </h3>

      {nowWatching ? (
        <div className="flex items-start gap-2">
          <span className="relative flex h-2.5 w-2.5 mt-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-secondary" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold font-mono text-foreground truncate">
              {nowWatching.title}
            </p>
            {nowWatching.episodeTitle && (
              <p className="text-xs text-muted-foreground truncate">
                {nowWatching.episodeTitle}
              </p>
            )}
          </div>
        </div>
      ) : lastWatched ? (
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-3">
            last watched
          </p>
          <p className="text-sm font-semibold font-mono text-foreground truncate mt-0.5 mb-0.5">
            {lastWatched.title}
          </p>
          {lastWatched.episodeTitle && (
            <p className="text-xs text-muted-foreground truncate">
              {lastWatched.episodeTitle}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">---</p>
      )}

      <div className="md:border-t md:border-border md:pt-3 mt-auto">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          all time
        </p>
        <div className="flex gap-4">
          <div>
            <span className="text-2xl font-bold font-mono tracking-tighter text-accent-tertiary">
              {allTime?.hours?.toLocaleString() ?? '---'}
            </span>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              hours
            </p>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono tracking-tighter text-accent-primary">
              {allTime?.movies?.toLocaleString() ?? '---'}
            </span>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              movies
            </p>
          </div>
          <div>
            <span className="text-2xl font-bold font-mono tracking-tighter text-accent-secondary">
              {allTime?.episodes?.toLocaleString() ?? '---'}
            </span>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              episodes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
