'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import TileSkeleton from './tile-skeleton'

const TIERS = [
  { key: 'now', label: 'now', accent: 'text-accent-primary' },
  { key: 'next', label: 'next', accent: 'text-accent-secondary' },
  { key: 'waiting', label: 'waiting', accent: 'text-accent-tertiary' },
  { key: 'blocked', label: 'blocked', accent: 'text-accent-secondary' },
  { key: 'someday', label: 'someday', accent: 'text-accent-tertiary' },
  { key: 'backlog', label: 'backlog', accent: 'text-accent-primary' },
]

export default function ObsidianTile() {
  const stats = useCachedFetch('/api/obsidian-stats', 'obsidian_stats', {
    shouldCache: (data) => data.active !== null,
  })

  if (!stats) return <TileSkeleton accent="primary" />

  const tiers = stats.tiers ?? {}

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-1">
        obsidian
      </h3>
      <span className="text-3xl font-bold font-mono tracking-tighter text-accent-primary">
        {stats.active ?? '---'}
      </span>
      <p className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground">
        active tasks
        {stats.overdue > 0 && (
          <span className="text-accent-secondary"> &middot; {stats.overdue} overdue</span>
        )}
      </p>

      <div className="flex flex-col gap-1.5 mt-auto pt-4">
        {TIERS.map(({ key, label, accent }) => (
          <div key={key} className="flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              {label}
            </span>
            <span className={`text-lg font-bold font-mono tracking-tighter ${accent}`}>
              {tiers[key] ?? '---'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
