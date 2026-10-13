'use client'

import { HEADLINE, textClass } from '../lib/accents.mjs'

export default function StatTile({
  value,
  label,
  accent = 'primary',
  children,
}) {
  return (
    <div className="flex flex-col h-full">
      <span className={`${HEADLINE} ${textClass[accent] || textClass.primary}`}>
        {value}
      </span>
      <span className="text-xs uppercase font-medium tracking-widest text-muted-foreground mt-1">
        {label}
      </span>
      {children && <div className="mt-auto pt-2">{children}</div>}
    </div>
  )
}
