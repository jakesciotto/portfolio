'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import { agoLabel, hoursToDays } from '../lib/format.mjs'
import TileSkeleton from './tile-skeleton'

const LABEL = 'text-[10px] uppercase font-medium tracking-widest text-muted-foreground'

function Stat({ value, label, className }) {
  return (
    <div>
      <span className={`font-mono text-2xl font-bold tracking-tighter ${className}`}>
        {value != null ? value.toLocaleString('en-US') : '---'}
      </span>
      <p className={LABEL}>{label}</p>
    </div>
  )
}

export default function TraktTile() {
  const stats = useCachedFetch('/api/trakt-stats', 'trakt_stats_v3', {
    ttl: 120000,
    shouldCache: (data) => data.nowWatching !== undefined,
  })

  if (!stats) return <TileSkeleton accent="amber" />

  const { nowWatching, lastWatched } = stats
  const all = stats.stats
  const topShows = all?.topShows || []
  const maxPlays = topShows[0]?.plays || 0
  const current = nowWatching || lastWatched

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-1 font-mono text-lg font-semibold tracking-tight text-foreground">trakt</h3>

      <div className="grid flex-1 grid-cols-1 gap-6.5 md:grid-cols-2">
        <div className="flex flex-col">
          {current ? (
            <div className="min-w-0">
              <span className={`flex items-center gap-2 ${LABEL}`}>
                {nowWatching && (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-secondary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-secondary" />
                  </span>
                )}
                {nowWatching ? 'watching now' : 'last watched'}
              </span>
              <p className="mt-1 truncate text-[15px] font-semibold leading-tight tracking-tight text-foreground">{current.title}</p>
              {current.episodeTitle && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{current.episodeTitle}</p>
              )}
              {!nowWatching && lastWatched.watchedAt && (
                <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">{agoLabel(lastWatched.watchedAt)}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">---</p>
          )}

          <div className="mt-auto pt-5">
            <span className={LABEL}>
              all time{all?.hours > 0 && ` · ${hoursToDays(all.hours)} days of screen`}
            </span>
            <div className="mt-1.5 flex gap-4">
              <Stat value={all?.hours} label="hours" className="text-accent-amber" />
              <Stat value={all?.movies} label="movies" className="text-accent-primary" />
              <Stat value={all?.episodes} label="episodes" className="text-accent-secondary" />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {topShows.length > 0 && (
            <>
              <span className={LABEL}>most watched</span>
              <div className="mt-2.5 grid grid-cols-[118px_1fr_40px] items-center gap-x-2.5 gap-y-2">
                {topShows.map((s) => (
                  <div key={s.title} className="contents">
                    <span className="truncate text-[12.5px] font-medium text-foreground">{s.title}</span>
                    <div className="h-1 overflow-hidden rounded-sm bg-border-strong">
                      <div className="h-full rounded-sm bg-accent-amber/80" style={{ width: `${maxPlays ? (s.plays / maxPlays) * 100 : 0}%` }} />
                    </div>
                    <span className="text-right font-mono text-[10.5px] tabular-nums text-muted-foreground">{s.plays}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {all?.last30 && (
            <p className="mt-auto pt-4 font-mono text-[10.5px] text-muted-foreground/70">
              last 30 days · {all.last30.episodes} episodes · {all.last30.movies} movies
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
