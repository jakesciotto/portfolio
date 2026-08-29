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
  const stats = useCachedFetch('/api/trakt-stats', 'trakt_stats_v2', {
    ttl: 120000,
    shouldCache: (data) => data.nowWatching !== undefined,
  })

  if (!stats) return <TileSkeleton accent="amber" />

  const { nowWatching, lastWatched } = stats
  const all = stats.stats
  const topShows = all?.topShows || []
  const maxPlays = topShows[0]?.plays || 0

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-1 font-mono text-lg font-semibold tracking-tight text-foreground">trakt</h3>

      <div className="grid flex-1 grid-cols-1 gap-6.5 md:grid-cols-2">
        <div className="flex flex-col">
          {nowWatching ? (
            <div className="flex items-start gap-2">
              <span className="relative mt-1.5 flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-secondary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-secondary" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold leading-tight tracking-tight text-foreground">{nowWatching.title}</p>
                {nowWatching.episodeTitle && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{nowWatching.episodeTitle}</p>
                )}
              </div>
            </div>
          ) : lastWatched ? (
            <div className="min-w-0">
              <span className={LABEL}>last watched</span>
              <p className="mt-1 truncate text-[15px] font-semibold leading-tight tracking-tight text-foreground">{lastWatched.title}</p>
              {lastWatched.episodeTitle && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{lastWatched.episodeTitle}</p>
              )}
              <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">{agoLabel(lastWatched.watchedAt)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">---</p>
          )}

          <div className="mt-auto pt-4">
            <span className={LABEL}>all time</span>
            <div className="mt-1.5 flex gap-4">
              <Stat value={all?.hours} label="hours" className="text-accent-amber" />
              <Stat value={all?.movies} label="movies" className="text-accent-primary" />
              <Stat value={all?.episodes} label="episodes" className="text-accent-secondary" />
            </div>
            {all?.hours > 0 && (
              <p className="mt-1.5 text-xs font-medium text-muted-foreground">
                that is <b className="font-semibold text-foreground">{hoursToDays(all.hours)} days</b> of screen time.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {topShows.length > 0 && (
            <>
              <span className={LABEL}>most watched shows</span>
              <div className="mt-3 grid grid-cols-[118px_1fr_40px] items-center gap-x-2.5 gap-y-2">
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
            <div className="mt-auto border-t border-border pt-3">
              <span className={LABEL}>last 30 days</span>
              <p className="mt-0.5 text-[13px] font-semibold tracking-tight text-foreground">
                {all.last30.episodes} episodes <span className="font-medium text-muted-foreground">· {all.last30.movies} movies</span>
              </p>
              <p className="mt-0.5 font-mono text-[10.5px] text-muted-foreground/70">{all.showsWatched} shows started all time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
