'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import { agoLabel } from '../lib/format.mjs'
import { tierCards } from '../lib/obsidian-row.mjs'
import { LABEL, textClass, bgClass } from '../lib/accents.mjs'
import Tile from './tile'
import TileSkeleton from './tile-skeleton'

const NUMBER = 'block mt-3 text-[40px] leading-none font-bold font-mono tracking-tighter'

function KpiBody({ label, count, accent, pct, zero }) {
  return (
    <>
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
    </>
  )
}

function SummaryBody({ active, overdue, lastSync }) {
  return (
    <>
      <h3 className="font-mono text-lg font-semibold tracking-tight text-foreground">obsidian</h3>
      <span className={`${NUMBER} mt-2 text-foreground`}>{active ?? '---'}</span>
      <span className={`${LABEL} mt-1.5`}>active tasks</span>
      {overdue > 0 && (
        <span className="mt-2 font-mono text-xs font-semibold text-accent-red">
          {overdue} <span className="font-medium text-muted-foreground/70">overdue</span>
        </span>
      )}
      <span className="mt-auto pt-3 font-mono text-[10px] text-muted-foreground/70">
        {agoLabel(lastSync, 'synced')}
      </span>
    </>
  )
}

export default function ObsidianRow() {
  const stats = useCachedFetch('/api/obsidian-stats', 'obsidian_stats', {
    ttl: 3600000,
    shouldCache: (data) => data.active !== null,
  })
  const cards = tierCards(stats)

  return (
    <div className="tile-obsidian obsidian-row">
      <Tile accent="primary" className="tile-kpi flex flex-col">
        {stats ? (
          <SummaryBody active={stats.active} overdue={stats.overdue} lastSync={stats.lastSync} />
        ) : (
          <TileSkeleton accent="primary" lines={2} />
        )}
      </Tile>
      {cards.map((c) => (
        <Tile key={c.key} accent={c.accent} className="tile-kpi flex flex-col">
          {stats ? (
            <KpiBody label={c.key} count={c.count} accent={c.accent} pct={c.pct} zero={c.zero} />
          ) : (
            <TileSkeleton accent={c.accent} lines={1} />
          )}
        </Tile>
      ))}
    </div>
  )
}
