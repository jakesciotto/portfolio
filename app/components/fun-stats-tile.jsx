'use client'

function daysSince(dateStr) {
  return Math.floor(
    (Date.now() - new Date(dateStr)) / (24 * 60 * 60 * 1000)
  )
}

function meetingsThisWeek() {
  const now = new Date()
  const weekNum = Math.floor(
    (now - new Date(now.getFullYear(), 0, 1)) /
      (7 * 24 * 60 * 60 * 1000)
  )
  const seed = now.getFullYear() * 100 + weekNum
  return 20 + (((seed * 9301 + 49297) % 233280) % 11)
}

function energyDrinksThisMonth() {
  const now = new Date()
  let total = 0
  for (let day = 1; day <= now.getDate(); day++) {
    const seed =
      now.getFullYear() * 10000 +
      (now.getMonth() + 1) * 100 +
      day
    total += (seed * 9301 + 49297) % 233280 > 116640 ? 3 : 2
  }
  return total
}

const funStats = [
  {
    label: 'days since pushing secrets to prod',
    value: daysSince('2023-02-10'),
  },
  {
    label: 'energy drinks this month',
    value: energyDrinksThisMonth(),
  },
  {
    label: 'meetings survived this week',
    value: meetingsThisWeek(),
  },
  { label: 'pets in my house', value: 5 },
  { label: 'years of student loan debt', value: '\u221E' },
  { label: 'knee surgeries', value: 5 },
  {
    label: 'days as #1 wife guy',
    value: daysSince('2021-09-25'),
  },
  {
    label: 'days suffering as a blue belt',
    value: daysSince('2024-10-24'),
  },
]

export default function FunStatsTile() {
  return (
    <div>
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-3">
        other stats
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {funStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-background/50 rounded-lg p-2"
          >
            <span className="text-lg font-bold font-mono tracking-tighter text-accent-tertiary">
              {stat.value}
            </span>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
