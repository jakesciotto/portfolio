'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import { shortDuration, weekdayShort } from '../lib/format.mjs'
import TileSkeleton from './tile-skeleton'
import Columns from './ui/columns'
import { Badge } from './ui/badge'

const LABEL = 'text-[10px] uppercase font-medium tracking-widest text-muted-foreground'
const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function dayInitial(isoDate) {
  const d = new Date(isoDate)
  return Number.isNaN(d.getTime()) ? '' : DAY_INITIALS[d.getUTCDay()]
}

export default function WakaTimeTile() {
  const stats = useCachedFetch('/api/wakatime-stats', 'wakatime_stats_v2', {
    shouldCache: (data) => data.totalHours != null,
  })

  if (!stats) return <TileSkeleton accent="primary" />

  const languages = (stats.languages || []).slice(0, 4)
  const topLang = languages[0]?.percent || 0
  const models = stats.models || []
  const modelTotal = models.reduce((sum, m) => sum + m.lines, 0)
  const lead = models[0]
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
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="muted">all time</Badge>
            <Badge variant="muted">{shortDuration(stats.dailyAverage)} / day</Badge>
          </div>

          {days.length > 1 && (
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className={LABEL}>this week</span>
                <span className="font-mono text-[11px] font-semibold text-foreground">
                  {shortDuration(stats.weekTotal)}
                  {stats.bestDay && (
                    <span className="font-medium text-muted-foreground/70">
                      {' '}· best {weekdayShort(stats.bestDay.date)}, {shortDuration(stats.bestDay.text)}
                    </span>
                  )}
                </span>
              </div>
              <Columns items={days} accent="primary" height={40} dim={0.45} label="Coding time per day this week" className="mt-4.5" />
            </div>
          )}

          {languages.length > 0 && (
            <div className="mt-auto pt-4">
              <span className={LABEL}>languages, last 7 days</span>
              <div className="mt-2 grid grid-cols-[62px_1fr_28px] items-center gap-x-2 gap-y-1.5">
                {languages.map((l, i) => (
                  <div key={l.name} className="contents">
                    <span className="truncate text-[10.5px] text-muted-foreground">{l.name}</span>
                    <div className="h-1 overflow-hidden rounded-sm bg-border-strong">
                      <div
                        className="h-full rounded-sm bg-accent-primary"
                        style={{ width: `${topLang ? (l.percent / topLang) * 100 : 0}%`, opacity: i === 0 ? 0.85 : 0.5 }}
                      />
                    </div>
                    <span className="text-right font-mono text-[10px] tabular-nums text-muted-foreground/70">
                      {Math.round(l.percent)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {lead && (
            <div className="pt-1.5">
              <span className={LABEL}>top model, last 7 days</span>
              <p className="mt-1 text-xl font-semibold leading-tight tracking-tight text-foreground">{lead.name}</p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                <b className="font-semibold text-foreground">{lead.lines.toLocaleString('en-US')} lines</b>
                {modelTotal > 0 && ` · ${Math.round((lead.lines / modelTotal) * 100)}% of the week`}
              </p>
            </div>
          )}
          {models.length > 1 && (
            <div className="mt-3.5 grid grid-cols-[50px_1fr_40px] items-center gap-x-2.5 gap-y-2">
              {models.slice(1).map((m) => (
                <div key={m.name} className="contents">
                  <span className="text-xs font-medium text-foreground">{m.name}</span>
                  <div className="h-1 overflow-hidden rounded-sm bg-border-strong">
                    <div className="h-full rounded-sm bg-accent-primary/80" style={{ width: `${(m.lines / lead.lines) * 100}%` }} />
                  </div>
                  <span className="text-right font-mono text-[10.5px] tabular-nums text-muted-foreground">
                    {m.lines.toLocaleString('en-US')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {stats.projects?.length > 0 && (
            <div className="mt-auto pt-4">
              <span className={LABEL}>projects, last 7 days</span>
              <div className="mt-2 grid grid-cols-[1fr_auto] items-baseline gap-x-2.5 gap-y-1.5">
                {stats.projects.map((p) => (
                  <div key={p.name} className="contents">
                    <span className="truncate text-[11px] font-medium text-foreground">{p.name}</span>
                    <span className="whitespace-nowrap font-mono text-[10px] tabular-nums text-muted-foreground/70">
                      {shortDuration(p.text)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
