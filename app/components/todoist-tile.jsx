'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import TileSkeleton from './tile-skeleton'

export default function TodoistTile() {
  const stats = useCachedFetch('/api/todoist-stats', 'todoist_stats', {
    shouldCache: (data) => data.active !== null,
  })

  if (!stats) return <TileSkeleton accent="primary" />

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-1">
        todoist
      </h3>
      <span className="text-3xl font-bold font-mono tracking-tighter text-accent-primary">
        {stats.active ?? '---'}
      </span>
      <p className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground">
        active tasks
      </p>
      <div className="flex gap-4 mt-auto">
        <div>
          <span className="text-2xl font-bold font-mono tracking-tighter text-accent-secondary">
            {stats.overdue ?? '---'}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            overdue
          </p>
        </div>
        <div>
          <span className="text-2xl font-bold font-mono tracking-tighter text-accent-tertiary">
            {stats.completedToday ?? '---'}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            today
          </p>
        </div>
        <div>
          <span className="text-2xl font-bold font-mono tracking-tighter text-accent-primary">
            {stats.completedThisWeek ?? '---'}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            this week
          </p>
        </div>
      </div>
    </div>
  )
}
