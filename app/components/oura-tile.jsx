'use client'

import { useCachedFetch } from '../lib/use-cached-fetch'
import TileSkeleton from './tile-skeleton'
import Sparkline from './ui/sparkline'

export default function OuraTile() {
  const stats = useCachedFetch('/api/oura-stats', 'oura_stats', {
    shouldCache: (data) => data.sleep?.current?.hours !== null,
  })

  if (!stats) return <TileSkeleton accent="tertiary" />

  const hours = stats.sleep?.current?.hours
  const score = stats.sleep?.current?.score
  const readiness = stats.readiness?.current
  const sleepTrend = stats.sleep?.trend?.hours

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-1">
        oura
      </h3>
      <span className="text-3xl font-bold font-mono tracking-tighter text-accent-tertiary">
        {hours ?? '---'}
      </span>
      <p className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground">
        hours slept
      </p>
      <div className="flex gap-4 mt-auto">
        <div>
          <span className="text-2xl font-bold font-mono tracking-tighter text-accent-primary">
            {score ?? '---'}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            sleep score
          </p>
        </div>
        <div>
          <span className="text-2xl font-bold font-mono tracking-tighter text-accent-secondary">
            {readiness ?? '---'}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            readiness score
          </p>
        </div>
      </div>
      {sleepTrend && sleepTrend.length >= 2 && (
        <Sparkline data={sleepTrend} color="tertiary" height={32} />
      )}
    </div>
  )
}
