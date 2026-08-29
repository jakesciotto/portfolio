'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import { agoLabel } from '../lib/format.mjs'
import { tierCards } from '../lib/obsidian-row.mjs'
import Tile from './tile'
import TileSkeleton from './tile-skeleton'

const LABEL = 'text-[10px] uppercase font-medium tracking-widest text-muted-foreground'
const NUMBER = 'block mt-3 text-[40px] leading-none font-bold font-mono tracking-tighter'

const textClass = {
  primary: 'text-accent-primary',
  secondary: 'text-accent-secondary',
  tertiary: 'text-accent-tertiary',
  amber: 'text-accent-amber',
  violet: 'text-accent-violet',
  red: 'text-accent-red',
}

const bgClass = {
  primary: 'bg-accent-primary',
  secondary: 'bg-accent-secondary',
  tertiary: 'bg-accent-tertiary',
  amber: 'bg-accent-amber',
  violet: 'bg-accent-violet',
  red: 'bg-accent-red',
}

function KpiCard({ label, count, accent, pct, zero }) {
  return (
    <Tile accent={accent} className="tile-kpi flex flex-col">
      <span className={`flex items-center gap-2 ${LABEL}`}>
        <i className={`inline-block h-[7px] w-[7px] rounded-[2px] ${bgClass[accent]}`} />
        {label}
      </span>
      <span className={`${NUMBER} ${zero ? 'text-muted-foreground/60' : textClass[accent]}`}>
        {count}
      </span>
      <div className="mt-auto pt-3.5">
        <div className="h-[3px] overflow-hidden rounded-sm bg-border-strong">
          <div className={`h-full rounded-sm ${bgClass[accent]}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="mt-1.5 block font-mono text-[10px] text-muted-foreground/70">{pct}%</span>
      </div>
    </Tile>
  )
}

function SummaryCard({ active, overdue, lastSync }) {
  return (
    <Tile accent="primary" className="tile-kpi flex flex-col">
      <span className={LABEL}>obsidian</span>
      <span className={`${NUMBER} text-foreground`}>{active ?? '---'}</span>
      <span className={`${LABEL} mt-1.5`}>active tasks</span>
      {overdue > 0 && (
        <span className="mt-2 font-mono text-xs font-semibold text-accent-red">
          {overdue} <span className="font-medium text-muted-foreground/70">overdue</span>
        </span>
      )}
      <span className="mt-auto pt-3 font-mono text-[10px] text-muted-foreground/70">
        {agoLabel(lastSync, 'synced')}
      </span>
    </Tile>
  )
}

export default function ObsidianRow() {
  const stats = useCachedFetch('/api/obsidian-stats', 'obsidian_stats', {
    shouldCache: (data) => data.active !== null,
  })
  const cards = tierCards(stats)

  return (
    <div className="tile-obsidian obsidian-row">
      {stats ? (
        <SummaryCard active={stats.active} overdue={stats.overdue} lastSync={stats.lastSync} />
      ) : (
        <Tile accent="primary" className="tile-kpi">
          <TileSkeleton accent="primary" lines={2} />
        </Tile>
      )}
      {cards.map((c) =>
        stats ? (
          <KpiCard key={c.key} label={c.key} count={c.count} accent={c.accent} pct={c.pct} zero={c.zero} />
        ) : (
          <Tile key={c.key} accent={c.accent} className="tile-kpi">
            <TileSkeleton accent={c.accent} lines={1} />
          </Tile>
        ),
      )}
    </div>
  )
}
