'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import StatTile from './stat-tile'
import TileSkeleton from './tile-skeleton'
import Sparkline from './ui/sparkline'

export default function GitHubTile() {
  const stats = useCachedFetch('/api/github-stats', 'gh_stats', {
    ttl: 300000,
    transform: (data) => ({
      commits7d: data.commits7d,
      prevCommits7d: data.prevCommits7d,
      daily: data.daily || [],
      isActive: data.isActive ?? false,
    }),
  })

  if (!stats) return <TileSkeleton accent="primary" />

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            stats.isActive
              ? 'bg-accent-secondary'
              : 'bg-muted-foreground'
          }`}
        />
        <span className="text-xs uppercase font-medium tracking-widest text-muted-foreground">
          github
        </span>
      </div>
      <StatTile
        value={stats.commits7d}
        label="commits this week"
        accent="primary"
      >
        {stats.daily && stats.daily.length > 0 && (
          <Sparkline data={stats.daily} color="primary" />
        )}
      </StatTile>
    </div>
  )
}
