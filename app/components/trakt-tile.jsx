'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import { agoLabel, hoursToDays } from '../lib/format.mjs'
import TileSkeleton from './tile-skeleton'
import BarList from './ui/bar-list'
import { LABEL } from '../lib/accents.mjs'

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
      <h3 className="mb-3 font-mono text-lg font-semibold tracking-tight text-foreground">trakt</h3>

      <div className="grid grid-cols-1 gap-6.5 md:grid-cols-2">
        <div>
          <span className={LABEL}>
            all time{all?.hours > 0 && ` · ${hoursToDays(all.hours)} days of screen`}
          </span>
          <div className="mt-1.5 flex gap-4">
            <Stat value={all?.hours} label="hours" className="text-accent-amber" />
            <Stat value={all?.movies} label="movies" className="text-accent-primary" />
            <Stat value={all?.episodes} label="episodes" className="text-accent-secondary" />
          </div>

          {current && (
            <div className="mt-6 min-w-0">
              <span className={`flex items-center gap-2 ${LABEL}`}>
                {nowWatching && (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-secondary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-secondary" />
                  </span>
                )}
                {nowWatching ? 'watching now' : 'last watched'}
                {!nowWatching && lastWatched.watchedAt && (
                  <span className="normal-case tracking-normal text-muted-foreground/70">· {agoLabel(lastWatched.watchedAt)}</span>
                )}
              </span>
              <p className="mt-1 truncate text-[15px] font-semibold leading-tight tracking-tight text-foreground">{current.title}</p>
              {current.episodeTitle && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{current.episodeTitle}</p>
              )}
            </div>
          )}
        </div>

        <div>
          {topShows.length > 0 && (
            <>
              <span className={LABEL}>most watched</span>
              <BarList
                rows={topShows.map((s) => ({ name: s.title, width: maxPlays ? (s.plays / maxPlays) * 100 : 0, value: s.plays, opacity: 0.8 }))}
                accent="amber"
                nameWidth={118}
                className="mt-2.5"
              />
            </>
          )}
          {all?.last30 && (
            <p className="mt-4 font-mono text-[10.5px] text-muted-foreground/70">
              last 30 days · {all.last30.episodes} episodes · {all.last30.movies} movies
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
