'use client'

import { layoutColumns } from '../../lib/columns.mjs'
import { accentVar } from '../../lib/accents.mjs'

export default function Columns({
  items = [],
  accent = 'primary',
  height = 92,
  dim = 0.82,
  fill = 0.8,
  label = '',
  className = '',
  captionAt = 'peak',
}) {
  if (!items.length) return null
  const cols = layoutColumns(items, { dim })
  const color = accentVar[accent] || accentVar.primary
  const captionFor = (c, i) => {
    if (captionAt === 'last')
      return i === cols.length - 1 ? items[i].caption : null
    return c.peak && !c.partial ? items[i].caption : null
  }
  const hasCaption = cols.some((c, i) => captionFor(c, i))

  return (
    <div className={`w-full ${className}`.trim()}>
      <div
        className={`relative flex items-end gap-1 border-b border-border ${hasCaption ? 'mt-5' : ''}`}
        style={{ height }}
        role="img"
        aria-label={label}
      >
        {cols.map((c, i) => {
          const caption = captionFor(c, i)
          return (
            <div
              key={i}
              tabIndex={0}
              aria-label={c.text}
              className="group relative flex h-full flex-1 flex-col justify-end rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-accent-primary"
            >
              {caption && (
                <span
                  className="absolute left-0 right-0 mb-0.5 whitespace-nowrap text-center font-mono text-[11.5px] text-foreground/90 group-hover:hidden group-focus-visible:hidden"
                  style={{ bottom: c.zero ? 2 : `${c.heightPct}%` }}
                >
                  {caption}
                </span>
              )}
              <span className="absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded border border-border-strong bg-card px-1.5 py-0.5 font-mono text-[11px] text-foreground group-hover:block group-focus-visible:block">
                {c.text}
              </span>
              <i
                className="mx-auto block rounded-t-[2px]"
                style={
                  c.zero
                    ? {
                        height: 2,
                        background: 'var(--border-strong)',
                        width: `${fill * 100}%`,
                      }
                    : {
                        height: `${c.heightPct}%`,
                        background: color,
                        opacity: c.opacity,
                        width: `${fill * 100}%`,
                      }
                }
              />
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-1">
        {cols.map((c, i) => (
          <span
            key={i}
            className="flex-1 text-center font-mono text-[11px] text-foreground/80"
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}
