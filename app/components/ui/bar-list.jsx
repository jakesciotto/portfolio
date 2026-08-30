import { bgClass } from '../../lib/accents.mjs'

export default function BarList({ rows = [], accent = 'primary', nameWidth = 104, className = '' }) {
  if (!rows.length) return null
  return (
    <div
      className={`grid items-center gap-x-2.5 gap-y-2.5 ${className}`.trim()}
      style={{ gridTemplateColumns: `${nameWidth}px 1fr auto` }}
    >
      {rows.map((r, i) => (
        <div key={r.name} className="contents">
          <span className="truncate text-[12.5px] font-medium text-foreground">{r.name}</span>
          <div className="h-1 overflow-hidden rounded-sm bg-border-strong">
            <div
              className={`h-full rounded-sm ${bgClass[accent] || bgClass.primary}`}
              style={{ width: `${Math.max(0, Math.min(100, r.width))}%`, opacity: r.opacity ?? (i === 0 ? 0.85 : 0.6) }}
            />
          </div>
          <span className="min-w-[34px] text-right font-mono text-[10.5px] tabular-nums text-muted-foreground">{r.value}</span>
        </div>
      ))}
    </div>
  )
}
