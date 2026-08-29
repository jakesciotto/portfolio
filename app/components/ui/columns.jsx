'use client'

import { layoutColumns } from '../../lib/columns.mjs'

const accentVar = {
  primary: 'var(--accent-primary)',
  secondary: 'var(--accent-secondary)',
  tertiary: 'var(--accent-tertiary)',
  amber: 'var(--accent-amber)',
  violet: 'var(--accent-violet)',
  red: 'var(--accent-red)',
}

export default function Columns({
  items = [],
  accent = 'primary',
  height = 92,
  dim = 0.82,
  label = '',
  className = '',
}) {
  if (!items.length) return null
  const cols = layoutColumns(items, { dim })
  const color = accentVar[accent] || accentVar.primary

  return (
    <div className={`w-full ${className}`.trim()}>
      <div
        className="relative flex items-end gap-1 border-b border-border-strong"
        style={{ height }}
        role="img"
        aria-label={label}
      >
        {cols.map((c, i) => (
          <div
            key={i}
            tabIndex={0}
            aria-label={c.text}
            className="group relative flex h-full flex-1 flex-col justify-end rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-accent-primary"
          >
            {c.peak && !c.partial && (
              <span className="absolute -top-4 left-0 right-0 whitespace-nowrap text-center font-mono text-[10px] text-foreground group-hover:hidden group-focus-visible:hidden">
                {c.text}
              </span>
            )}
            <span className="absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded border border-border-strong bg-card px-1.5 py-0.5 font-mono text-[10px] text-foreground group-hover:block group-focus-visible:block">
              {c.text}
            </span>
            <i
              className="mx-auto block w-full rounded-t-[3px]"
              style={
                c.zero
                  ? { height: 2, background: 'var(--border-strong)' }
                  : { height: `${c.heightPct}%`, background: color, opacity: c.opacity, maxWidth: 24 }
              }
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1">
        {cols.map((c, i) => (
          <span key={i} className="flex-1 text-center font-mono text-[9.5px] text-muted-foreground/70">
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}
