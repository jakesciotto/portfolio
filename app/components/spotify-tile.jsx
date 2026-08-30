'use client'

import { useState } from 'react'
import { useCachedFetch } from '../lib/use-cached-fetch'
import { spotifyView } from '../lib/spotify-view.mjs'
import TileSkeleton from './tile-skeleton'
import Columns from './ui/columns'
import PeriodPills from './ui/period-pills'
import { Badge } from './ui/badge'

const LABEL = 'text-[10px] uppercase font-medium tracking-widest text-muted-foreground'
const TABS = [
  { key: 'alltime', label: 'all-time' },
  { key: 'recent', label: 'recent' },
]

function Lead({ label, name, line }) {
  return (
    <div>
      <span className={LABEL}>{label}</span>
      <p className="mt-1 text-xl font-semibold leading-tight tracking-tight text-foreground">{name}</p>
      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{line}</p>
    </div>
  )
}

function AllTime({ view }) {
  return (
    <>
      {view.lead && (
        <Lead
          label="top artist"
          name={view.lead.name}
          line={
            <>
              <b className="font-semibold text-foreground">{view.lead.hours} hours</b>
              {view.lead.sharePct != null && ` · ${view.lead.sharePct}% of everything`}
            </>
          }
        />
      )}
      <div className="mt-4 grid grid-cols-[104px_1fr_42px] items-center gap-x-2.5 gap-y-2.5">
        {view.bars.map((a) => (
          <div key={a.name} className="contents">
            <span className="truncate text-[12.5px] font-medium text-foreground">{a.name}</span>
            <div className="h-1 overflow-hidden rounded-sm bg-border-strong">
              <div className="h-full rounded-sm bg-accent-tertiary/80" style={{ width: `${a.width}%` }} />
            </div>
            <span className="text-right font-mono text-[10.5px] tabular-nums text-muted-foreground">{a.hours}h</span>
          </div>
        ))}
      </div>
      {view.onRepeat && (
        <p className="mt-4 font-mono text-[10.5px] text-muted-foreground/70">
          on repeat · {view.onRepeat.name}, {view.onRepeat.artist}
          {view.onRepeat.plays != null && ` · ${view.onRepeat.plays.toLocaleString('en-US')} plays`}
        </p>
      )}
    </>
  )
}

function Recent({ era }) {
  const artists = era?.artists || []
  const tracks = era?.tracks || []
  return (
    <>
      {artists[0] && <Lead label="top artist, last 4 weeks" name={artists[0].name} line="live from spotify" />}
      {artists.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {artists.slice(1, 3).map((a) => (
            <Badge key={a.name} variant="outline" className="text-xs font-medium normal-case tracking-tight">
              {a.name}
            </Badge>
          ))}
        </div>
      )}
      {tracks.length > 0 && (
        <div className="mt-4 flex flex-col gap-1">
          {tracks.slice(0, 3).map((t) => (
            <p key={`${t.name}-${t.artist}`} className="truncate text-[13px] font-medium text-foreground">
              {t.name} <span className="text-muted-foreground">- {t.artist}</span>
            </p>
          ))}
        </div>
      )}
    </>
  )
}

export default function SpotifyTile() {
  const [tab, setTab] = useState('alltime')

  const stats = useCachedFetch('/api/spotify-stats', 'spotify_stats_v2', {
    ttl: 3600000,
    shouldCache: (data) => !!data.overview,
  })
  const topItems = useCachedFetch('/api/spotify-top', 'spotify_top', {
    ttl: 3600000,
    shouldCache: (data) => !!(data.shortTerm || data.longTerm),
  })

  const view = spotifyView(stats)
  if (!view) return <TileSkeleton accent="tertiary" lines={4} />

  const hasLive = !!topItems?.shortTerm?.artists?.length
  const showRecent = hasLive && tab === 'recent'

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono text-lg font-semibold tracking-tight text-foreground">spotify</h3>
        {hasLive && <PeriodPills options={TABS} value={tab} onChange={setTab} accent="tertiary" label="Spotify range" />}
      </div>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-[1.15fr_1fr]">
        <div>
          <span className="font-mono text-[44px] font-bold leading-none tracking-tighter text-accent-tertiary">
            {view.hours}
            <span className="ml-1.5 text-[13px] font-semibold tracking-normal text-muted-foreground">hours</span>
          </span>
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {view.streams} streams, {view.since} to {view.through}.{' '}
            <b className="font-semibold text-foreground">{view.yearsOfAudio} years</b> of audio, back to back.
          </p>
          {view.yearly.length > 1 && (
            <div className="mt-6">
              <span className={LABEL}>hours per year</span>
              <Columns items={view.yearly} accent="tertiary" height={132} barWidth={18} label="Listening hours per year" className="mt-1" />
            </div>
          )}
        </div>

        <div>{showRecent ? <Recent era={topItems.shortTerm} /> : <AllTime view={view} />}</div>
      </div>
    </div>
  )
}
