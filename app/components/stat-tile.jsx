'use client'

export default function StatTile({
  value,
  label,
  secondaryLabel,
  heading,
  accent = 'primary',
  children,
}) {
  const accentColor = {
    primary: 'text-accent-primary',
    secondary: 'text-accent-secondary',
    tertiary: 'text-accent-tertiary',
  }

  return (
    <div className="flex flex-col h-full">
      {heading && (
        <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-1">
          {heading}
        </h3>
      )}
      <span
        className={`text-4xl font-bold font-mono tracking-tighter ${accentColor[accent] || accentColor.primary}`}
      >
        {value}
      </span>
      <span className="text-xs uppercase font-medium tracking-widest text-muted-foreground mt-1">
        {label}
      </span>
      {secondaryLabel && (
        <span className="text-[10px] text-muted-foreground mt-0.5">
          {secondaryLabel}
        </span>
      )}
      {children && <div className="mt-auto pt-2">{children}</div>}
    </div>
  )
}
