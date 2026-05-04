'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import TileSkeleton from './tile-skeleton'
import Sparkline from './ui/sparkline'

function TopSection({ label, artists = [], tracks = [] }) {
  if (!artists.length && !tracks.length) return null

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <p className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground">
        {label}
      </p>
      {artists.length > 0 && (
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">artists</p>
          {artists.map((a, i) => (
            <p key={i} className="text-xs font-medium text-foreground truncate">{a.name}</p>
          ))}
        </div>
      )}
      {tracks.length > 0 && (
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">tracks</p>
          {tracks.map((t, i) => (
            <p key={i} className="text-xs text-foreground truncate">
              {t.name} <span className="text-muted-foreground">- {t.artist}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SpotifyTile() {
  const stats = useCachedFetch('/api/spotify-stats', 'spotify_stats', {
    shouldCache: (data) => !!data.overview,
  })

  const topItems = useCachedFetch('/api/spotify-top', 'spotify_top', {
    shouldCache: (data) => !!(data.shortTerm || data.longTerm),
  })

  if (!stats) return <TileSkeleton accent="tertiary" lines={4} />

  const yearlyHours = Array.isArray(stats.yearlyHours) ? stats.yearlyHours : []

  const firstYear = stats.overview?.firstStream?.slice(0, 4)
  const currentYear = new Date().getFullYear()
  const span = firstYear
    ? `${currentYear - parseInt(firstYear)} years of data`
    : null

  // Fall back to Redis-cached top items if live API data hasn't loaded
  const hasLiveTop = topItems?.shortTerm || topItems?.longTerm
  const fallbackArtist = stats.topArtists?.[0]?.name
  const fallbackTrack = stats.topTracks?.[0]?.name

  return (
    <div className="flex flex-col justify-between h-full gap-3">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground">
        spotify
      </h3>

      {hasLiveTop ? (
        <div className="grid grid-cols-2 gap-3">
          <TopSection
            label="recent favorites"
            artists={topItems.shortTerm?.artists || []}
            tracks={topItems.shortTerm?.tracks || []}
          />
          <TopSection
            label="all-time favorites"
            artists={topItems.longTerm?.artists || []}
            tracks={topItems.longTerm?.tracks || []}
          />
        </div>
      ) : (fallbackArtist || fallbackTrack) ? (
        <div className="flex gap-4">
          {fallbackArtist && (
            <div>
              <p className="text-sm font-semibold text-foreground truncate">{fallbackArtist}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                top artist
              </p>
            </div>
          )}
          {fallbackTrack && (
            <div>
              <p className="text-sm font-semibold text-foreground truncate">{fallbackTrack}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                top track
              </p>
            </div>
          )}
        </div>
      ) : null}

      {yearlyHours.length > 0 && (
        <Sparkline
          data={yearlyHours.map((y) => Math.round(y.hours || 0))}
          color="tertiary"
          height={48}
          tooltipLabel="hours"
        />
      )}

      {span && (
        <p className="text-[10px] text-muted-foreground mt-auto">{span}</p>
      )}
    </div>
  )
}
