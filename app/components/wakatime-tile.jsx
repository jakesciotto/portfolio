'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import { shortDuration } from '../lib/format.mjs'
import TileSkeleton from './tile-skeleton'
import Columns from './ui/columns'

const LABEL = 'text-[10px] uppercase font-medium tracking-widest text-muted-foreground'
const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function dayInitial(isoDate) {
  const d = new Date(isoDate)
  return Number.isNaN(d.getTime()) ? '' : DAY_INITIALS[d.getUTCDay()]
}

export default function WakaTimeTile() {
  const stats = useCachedFetch('/api/wakatime-stats', 'wakatime_stats_v3', {
    shouldCache: (data) => data.totalHours != null,
  })

  if (!stats) return <TileSkeleton accent="primary" />

  const languages = stats.languages || []
  const topLang = languages[0]?.percent || 0
  const models = stats.models || []
  const modelTotal = models.reduce((sum, m) => sum + m.lines, 0)
  const days = (stats.days || []).map((d) => ({
    label: dayInitial(d.date),
    value: d.seconds,
    text: shortDuration(d.text),
  }))

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-1 font-mono text-lg font-semibold tracking-tight text-foreground">programmin'</h3>

      <div className="grid flex-1 grid-cols-1 gap-6.5 md:grid-cols-2">
        <div className="flex flex-col">
          <span className="font-mono text-3xl font-bold tracking-tighter text-accent-primary">
            {stats.totalHours != null ? stats.totalHours.toLocaleString('en-US') : '---'}
            <span className="ml-1.5 text-sm font-semibold tracking-normal text-muted-foreground">hrs</span>
          </span>
          <p className="mt-1 font-mono text-[10.5px] text-muted-foreground/70">
            all time{stats.dailyAverage && ` · ${shortDuration(stats.dailyAverage)} a day`}
          </p>

          {days.length > 1 && (
            <div className="mt-auto pt-5">
              <div className="flex items-baseline justify-between">
                <span className={LABEL}>this week</span>
                <span className="font-mono text-[11px] font-semibold text-foreground">{shortDuration(stats.weekTotal)}</span>
              </div>
              <Columns items={days} accent="primary" height={44} dim={0.45} label="Coding time per day this week" className="mt-4.5" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {languages.length > 0 && (
            <>
              <span className={LABEL}>languages, {stats.languagesRange}</span>
              <div className="mt-2.5 grid grid-cols-[76px_1fr_34px] items-center gap-x-2.5 gap-y-2">
                {languages.map((l, i) => (
                  <div key={l.name} className="contents">
                    <span className="truncate text-[12px] font-medium text-foreground">{l.name}</span>
                    <div className="h-1 overflow-hidden rounded-sm bg-border-strong">
                      <div
                        className="h-full rounded-sm bg-accent-primary"
                        style={{ width: `${topLang ? (l.percent / topLang) * 100 : 0}%`, opacity: i === 0 ? 0.85 : 0.55 }}
                      />
                    </div>
                    <span className="text-right font-mono text-[10.5px] tabular-nums text-muted-foreground">
                      {Math.round(l.percent)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
          {models.length > 0 && modelTotal > 0 && (
            <p className="mt-auto pt-4 font-mono text-[10.5px] text-muted-foreground/70">
              models this week ·{' '}
              {models.map((m) => `${m.name.toLowerCase()} ${Math.round((m.lines / modelTotal) * 100)}%`).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
