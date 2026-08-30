'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import { agoLabel, hoursToDays } from '../lib/format.mjs'
import { LABEL } from '../lib/accents.mjs'
import TileSkeleton from './tile-skeleton'
import BarList from './ui/bar-list'

function episodeCode(episodeTitle) {
  return episodeTitle ? episodeTitle.split(' - ')[0] : ''
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
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="font-mono text-lg font-semibold tracking-tight text-foreground">trakt</h3>
        {current && (
          <p className="flex min-w-0 items-center gap-2 font-mono text-[10.5px] text-muted-foreground/70">
            {nowWatching && (
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-secondary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-secondary" />
              </span>
            )}
            <span className="truncate">
              {nowWatching ? 'watching now' : 'last watched'} ·{' '}
              <span className="text-foreground">
                {current.title}
                {episodeCode(current.episodeTitle) && ` ${episodeCode(current.episodeTitle)}`}
              </span>
              {!nowWatching && lastWatched.watchedAt && ` · ${agoLabel(lastWatched.watchedAt)}`}
            </span>
          </p>
        )}
      </div>

      <div>
        <span className="font-mono text-4xl font-bold leading-none tracking-tighter text-accent-amber">
          {all?.hours != null ? all.hours.toLocaleString('en-US') : '---'}
          <span className="ml-1.5 text-[13px] font-semibold tracking-normal text-muted-foreground">hours</span>
        </span>
        {all && (
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {hoursToDays(all.hours)} days of screen.{' '}
            <b className="font-semibold text-foreground">{all.movies.toLocaleString('en-US')}</b> movies,{' '}
            <b className="font-semibold text-foreground">{all.episodes.toLocaleString('en-US')}</b> episodes.
          </p>
        )}
      </div>

      {topShows.length > 0 && (
        <div className="mt-5">
          <span className={LABEL}>most watched</span>
          <BarList
            rows={topShows.map((s) => ({ name: s.title, width: maxPlays ? (s.plays / maxPlays) * 100 : 0, value: s.plays, opacity: 0.8 }))}
            accent="amber"
            nameWidth={150}
            className="mt-2.5"
          />
        </div>
      )}

      {all?.last30 && (
        <p className="mt-auto pt-4 font-mono text-[10.5px] text-muted-foreground/70">
          last 30 days · {all.last30.episodes} episodes · {all.last30.movies} movies
        </p>
      )}
    </div>
  )
}
