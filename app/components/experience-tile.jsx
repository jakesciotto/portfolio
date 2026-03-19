export default function ExperienceTile() {
  const start = new Date('2016-01-01')
  const years = Math.floor(
    (Date.now() - start) / (365.25 * 24 * 60 * 60 * 1000),
  )

  return (
    <div className="flex flex-col justify-center h-full">
      <span className="text-4xl font-bold font-mono tracking-tighter text-accent-secondary">
        {years}+
      </span>
      <span className="text-xs uppercase font-medium tracking-widest text-muted-foreground mt-1">
        years in tech
      </span>
      <span className="text-xs lowercase tracking-narrowest text-muted-foreground mt-2">
        but i put linux on the family computer when i was 16 so
      </span>
    </div>
  )
}
