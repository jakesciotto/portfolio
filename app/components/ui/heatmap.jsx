'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

const accentVar = {
  primary: 'var(--accent-primary)',
  secondary: 'var(--accent-secondary)',
  tertiary: 'var(--accent-tertiary)',
  amber: 'var(--accent-amber)',
  violet: 'var(--accent-violet)',
  red: 'var(--accent-red)',
}

const LEVEL_OPACITY = [0.06, 0.28, 0.5, 0.72, 1]

function levelFor(count, max) {
  if (!count) return 0
  if (max <= 0) return 1
  return Math.min(4, Math.max(1, Math.ceil((count / max) * 4)))
}

function dayKey(d) {
  return d.toISOString().slice(0, 10)
}

function buildGrid(weeks) {
  const today = new Date()
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (weeks - 1) * 7 - end.getUTCDay())
  const columns = []
  const cursor = new Date(start)
  for (let w = 0; w < weeks; w++) {
    const col = []
    for (let d = 0; d < 7; d++) {
      col.push(cursor > end ? null : new Date(cursor))
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    columns.push(col)
  }
  return columns
}

export default function Heatmap({ data = {}, weeks = 52, accent = 'primary' }) {
  const max = Object.values(data).reduce((m, c) => (c > m ? c : m), 0)
  const color = accentVar[accent] || accentVar.primary
  const columns = buildGrid(weeks)

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex gap-[3px] mt-2 w-full" role="img" aria-label="GitHub activity heatmap">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[3px] flex-1">
            {col.map((date, ri) => {
              if (!date) return <div key={ri} className="w-full aspect-square" />
              const key = dayKey(date)
              const count = data[key] || 0
              const level = levelFor(count, max)
              return (
                <Tooltip key={ri}>
                  <TooltipTrigger asChild>
                    <div
                      className="w-full aspect-square rounded-[2px]"
                      style={{ backgroundColor: color, opacity: LEVEL_OPACITY[level] }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {count} {count === 1 ? 'thing' : 'things'} on {key}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}
