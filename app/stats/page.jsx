import StatCard from '../components/stat-card'
import GitHubStats from '../components/github-stats'
import AnimatedSection from '../components/animated-section'

function daysSince(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr)) / (24 * 60 * 60 * 1000))
}

// seeded random per week so the number is stable within a week
function meetingsThisWeek() {
  const now = new Date()
  const weekNum = Math.floor((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000))
  const seed = now.getFullYear() * 100 + weekNum
  return 20 + ((seed * 9301 + 49297) % 233280) % 11
}

// seeded random per day so the number doesn't change on refresh
function energyDrinksThisMonth() {
  const now = new Date()
  let total = 0
  for (let day = 1; day <= now.getDate(); day++) {
    const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + day
    total += (seed * 9301 + 49297) % 233280 > 116640 ? 3 : 2
  }
  return total
}

export default function StatsPage() {
  const meetings = meetingsThisWeek()
  const daysClean = daysSince('2023-02-10')
  const drinksThisMonth = energyDrinksThisMonth()
  const daysMarried = daysSince('2021-09-25')
  const daysSuffering = daysSince('2024-10-24')

  return (
    <div className="mt-12 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-semibold text-6xl mb-2 tracking-tighter gradient-text">
          live stats
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          if numbers are important to you
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Primary stats - top three filled cards */}
        <AnimatedSection delay={100}>
          <StatCard
            title="days since pushing secrets to prod"
            value={daysClean}
            variant="primary"
            animateNumber={true}
          />
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <StatCard
            title="energy drinks this month"
            value={drinksThisMonth}
            variant="primary"
            animateNumber={true}
          />
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <StatCard
            title="meetings survived this week"
            value={meetings}
            variant="primary"
            animateNumber={true}
          />
        </AnimatedSection>

        {/* GitHub stats - auto-refreshing */}
        <AnimatedSection delay={250}>
          <GitHubStats />
        </AnimatedSection>

        {/* Personal stats */}

        <AnimatedSection delay={300}>
          <StatCard title="pets in my house" value={5} variant="secondary" />
        </AnimatedSection>

        <AnimatedSection delay={350}>
          <StatCard
            title="years of student loan debt to pay off"
            value="∞"
            variant="secondary"
          />
        </AnimatedSection>

        <AnimatedSection delay={350}>
          <StatCard
            title="knee surgeries"
            value={5}
            subtitle="yea i am still training martial arts"
            variant="secondary"
          />
        </AnimatedSection>

        <AnimatedSection delay={350}>
          <StatCard
            title="days as #1 wife guy"
            value={daysMarried}
            variant="secondary"
          />
        </AnimatedSection>

        <AnimatedSection delay={500}>
          <StatCard
            title="days suffering as a blue belt"
            value={daysSuffering}
            variant="secondary"
          />
        </AnimatedSection>
      </div>

      {/* Footer note */}
      <div className="mt-12 mb-8 text-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          github stats auto-refresh every 5 minutes. manual stats updated when i
          remember.
        </p>
      </div>
    </div>
  )
}
