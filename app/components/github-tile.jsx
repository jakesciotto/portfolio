'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import StatTile from './stat-tile'
import TileSkeleton from './tile-skeleton'
import Heatmap from './ui/heatmap'

const HEATMAP_WEEKS = 17 // footprint tuned to the current tile width; adjust with layout

export default function GitHubTile() {
  const stats = useCachedFetch('/api/github-stats', 'gh_stats_v2', {
    ttl: 300000,
    shouldCache: (s) => Object.keys(s.days).length > 0,
    transform: (data) => ({
      activity7d: data.activity7d,
      days: data.days || {},
      isActive: data.isActive ?? false,
    }),
  })

  if (!stats) return <TileSkeleton accent="primary" />

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            stats.isActive ? 'bg-accent-secondary' : 'bg-muted-foreground'
          }`}
        />
        <span className="text-xs uppercase font-medium tracking-widest text-muted-foreground">
          github
        </span>
      </div>
      <StatTile value={stats.activity7d} label="things this week" accent="primary">
        <Heatmap data={stats.days} weeks={HEATMAP_WEEKS} accent="primary" />
      </StatTile>
    </div>
  )
}
