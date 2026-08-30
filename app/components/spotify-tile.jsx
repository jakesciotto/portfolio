'use client'

import { useState } from 'react'
import { useCachedFetch } from '../lib/use-cached-fetch'
import { spotifyView } from '../lib/spotify-view.mjs'
import { LABEL } from '../lib/accents.mjs'
import TileSkeleton from './tile-skeleton'
import Columns from './ui/columns'
import PeriodPills from './ui/period-pills'

const TABS = [
  { key: 'alltime', label: 'all-time' },
  { key: 'recent', label: 'recent' },
]

function Lead({ label, name, line }) {
  return (
    <div className="shrink-0 text-right">
      <span className={LABEL}>{label}</span>
      <p className="mt-1 text-xl font-semibold leading-tight tracking-tight text-foreground">{name}</p>
      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{line}</p>
    </div>
  )
}

function Strip({ label, items }) {
  if (!items.length) return null
  return (
    <div>
      <span className={LABEL}>{label}</span>
      <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted-foreground">
        {items.map((it, i) => (
          <span key={it.name}>
            {i > 0 && <span className="text-muted-foreground/50"> · </span>}
            <span className="font-medium text-foreground">{it.name}</span>
            {it.meta && ` ${it.meta}`}
          </span>
        ))}
      </p>
    </div>
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
    shouldCache: (data) => !!data.shortTerm,
  })

  const view = spotifyView(stats)
  if (!view) return <TileSkeleton accent="tertiary" lines={4} />

  const live = topItems?.shortTerm
  const hasLive = !!live?.artists?.length
  const recent = hasLive && tab === 'recent'

  const lead = recent
    ? { label: 'top artist, last 4 weeks', name: live.artists[0].name, line: 'live from spotify' }
    : view.lead && {
        label: 'top artist',
        name: view.lead.name,
        line: (
          <>
            <b className="font-semibold text-foreground">{view.lead.hours} hours</b>
            {view.lead.sharePct != null && ` · ${view.lead.sharePct}%`}
          </>
        ),
      }

  const strip = recent
    ? { label: 'also on repeat', items: (live.tracks || []).slice(0, 3).map((t) => ({ name: t.name, meta: `, ${t.artist}` })) }
    : { label: 'then', items: view.bars.map((a) => ({ name: a.name, meta: `${a.hours}h` })) }

  const footer = recent
    ? live.artists.length > 1 && `also · ${live.artists.slice(1, 3).map((a) => a.name).join(' · ')}`
    : view.onRepeat &&
      `on repeat · ${view.onRepeat.name}, ${view.onRepeat.artist}${
        view.onRepeat.plays != null ? ` · ${view.onRepeat.plays.toLocaleString('en-US')} plays` : ''
      }`

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono text-lg font-semibold tracking-tight text-foreground">spotify</h3>
        {hasLive && <PeriodPills options={TABS} value={tab} onChange={setTab} accent="tertiary" label="Spotify range" />}
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <span className="font-mono text-[44px] font-bold leading-none tracking-tighter text-accent-tertiary">
            {view.hours}
            <span className="ml-1.5 text-[13px] font-semibold tracking-normal text-muted-foreground">hours</span>
          </span>
          <p className="mt-2 max-w-[30ch] text-xs font-medium text-muted-foreground">
            {view.streams} streams, {view.since} to {view.through}.{' '}
            <b className="font-semibold text-foreground">{view.yearsOfAudio} years</b> of audio, back to back.
          </p>
        </div>
        {lead && <Lead {...lead} />}
      </div>

      {view.yearly.length > 1 && (
        <div className="mt-6">
          <span className={LABEL}>hours per year</span>
          <Columns items={view.yearly} accent="tertiary" height={118} barWidth={22} label="Listening hours per year" className="mt-1" />
        </div>
      )}

      <div className="mt-5">
        <Strip {...strip} />
      </div>

      {footer && <p className="mt-auto pt-4 font-mono text-[10.5px] text-muted-foreground/70">{footer}</p>}
    </div>
  )
}
