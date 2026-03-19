const accentBgMap = {
  primary: 'bg-accent-primary/10',
  secondary: 'bg-accent-secondary/10',
  tertiary: 'bg-accent-tertiary/10',
}

const lineWidths = ['85%', '70%', '95%', '75%', '90%']

export default function TileSkeleton({
  accent = 'primary',
  lines = 3,
}) {
  const bg = accentBgMap[accent] || accentBgMap.primary
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <div className={`h-8 w-20 rounded ${bg}`} />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 rounded ${bg}`}
          style={{ width: lineWidths[i % lineWidths.length] }}
        />
      ))}
    </div>
  )
}
