'use client'

const activeClass = {
  primary: 'text-accent-primary border-accent-primary/40 bg-accent-primary/10',
  secondary: 'text-accent-secondary border-accent-secondary/40 bg-accent-secondary/10',
  tertiary: 'text-accent-tertiary border-accent-tertiary/40 bg-accent-tertiary/10',
  amber: 'text-accent-amber border-accent-amber/40 bg-accent-amber/10',
  violet: 'text-accent-violet border-accent-violet/40 bg-accent-violet/10',
  red: 'text-accent-red border-accent-red/40 bg-accent-red/10',
}

export default function PeriodPills({ options, value, onChange, accent = 'primary', label = '' }) {
  return (
    <div className="flex gap-1" role="tablist" aria-label={label}>
      {options.map((o) => {
        const on = o.key === value
        return (
          <button
            key={o.key}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.key)}
            className={`cursor-pointer rounded border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest transition-colors duration-200 ${
              on
                ? activeClass[accent] || activeClass.primary
                : 'border-border-strong text-muted-foreground hover:text-foreground'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
