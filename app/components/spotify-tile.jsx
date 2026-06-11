'use client'

import { useState } from 'react'
import { useCachedFetch } from '../lib/use-cached-fetch'
import TileSkeleton from './tile-skeleton'
import BarSpark from './ui/bar-spark'
import { Badge } from './ui/badge'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatWeek(iso) {
  if (!iso) return ''
  const [, m, d] = iso.split('-').map(Number)
  return `wk of ${MONTHS[m - 1]} ${d}`
}

function EraContent({ artists = [], tracks = [] }) {
  return (
    <div className="flex flex-col gap-2.5 min-w-0 animate-fade-in">
      {artists.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {artists.map((a, i) => (
            <Badge
              key={i}
              variant="outline"
              className="normal-case tracking-tight text-xs font-medium"
            >
              {a.name}
            </Badge>
          ))}
        </div>
      )}
      {tracks.length > 0 && (
        <div className="flex flex-col gap-1">
          {tracks.map((t, i) => (
            <p key={i} className="text-sm font-medium text-foreground truncate">
              {t.name} <span className="text-muted-foreground">- {t.artist}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SpotifyTile() {
  const [tab, setTab] = useState('recent')

  const stats = useCachedFetch('/api/spotify-stats', 'spotify_stats', {
    shouldCache: (data) => !!data.overview,
  })

  const topItems = useCachedFetch('/api/spotify-top', 'spotify_top', {
    shouldCache: (data) => !!(data.shortTerm || data.longTerm),
  })

  if (!stats) return <TileSkeleton accent="tertiary" lines={4} />

  const weeklyHours = Array.isArray(stats.weeklyHours) ? stats.weeklyHours : []
  const recentWeeks = weeklyHours.slice(-52)

  const firstYear = stats.overview?.firstStream?.slice(0, 4)
  const currentYear = new Date().getFullYear()
  const span = firstYear
    ? `${currentYear - parseInt(firstYear)} years of data`
    : null

  // Fall back to Redis-cached top items if live API data hasn't loaded
  const hasLiveTop = topItems?.shortTerm || topItems?.longTerm
  const fallbackArtist = stats.topArtists?.[0]?.name
  const fallbackTrack = stats.topTracks?.[0]?.name

  const TABS = [
    {
      key: 'recent',
      label: 'recent',
      activeText: 'text-accent-secondary',
      activeBorder: 'border-accent-secondary',
      era: topItems?.shortTerm,
    },
    {
      key: 'all-time',
      label: 'all-time',
      activeText: 'text-accent-tertiary',
      activeBorder: 'border-accent-tertiary',
      era: topItems?.longTerm,
    },
  ]
  const active = TABS.find((t) => t.key === tab) || TABS[0]

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground">
          spotify
        </h3>
        {hasLiveTop && (
          <div className="flex items-center gap-3">
            {TABS.map((t) => {
              const isActive = t.key === active.key
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`text-[11px] font-semibold uppercase tracking-widest pb-0.5 border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? `${t.activeText} ${t.activeBorder}`
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {hasLiveTop ? (
        <EraContent
          key={active.key}
          artists={active.era?.artists || []}
          tracks={active.era?.tracks || []}
        />
      ) : fallbackArtist || fallbackTrack ? (
        <div className="flex gap-4">
          {fallbackArtist && (
            <div>
              <p className="text-sm font-semibold text-foreground truncate">
                {fallbackArtist}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                top artist
              </p>
            </div>
          )}
          {fallbackTrack && (
            <div>
              <p className="text-sm font-semibold text-foreground truncate">
                {fallbackTrack}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                top track
              </p>
            </div>
          )}
        </div>
      ) : null}

      <div className="mt-auto flex flex-col gap-1.5">
        {recentWeeks.length > 1 && (
          <BarSpark
            data={recentWeeks.map((w) => Math.round(w.hours || 0))}
            labels={recentWeeks.map((w) => formatWeek(w.week))}
            color="tertiary"
            height={72}
            tooltipLabel="hours"
          />
        )}

        {span && (
          <p className="text-[10px] font-medium text-muted-foreground">{span}</p>
        )}
      </div>
    </div>
  )
}
