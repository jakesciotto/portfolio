import StatCard from '../components/stat-card'
import GitHubStats from '../components/github-stats'
import OuraStats from '../components/oura-sleep-stats'
import AnimatedSection from '../components/animated-section'

function daysSince(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr)) / (24 * 60 * 60 * 1000))
}

function meetingsThisWeek() {
  const now = new Date()
  const weekNum = Math.floor(
    (now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000),
  )
  const seed = now.getFullYear() * 100 + weekNum
  return 20 + (((seed * 9301 + 49297) % 233280) % 11)
}

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
        <p className="text-sm text-muted-foreground">
          if numbers are important to you
        </p>
      </div>

      {/* Health Section */}
      <div className="mb-4">
        <h2 className="font-semibold text-3xl mb-1 tracking-tighter text-foreground">
          health
        </h2>
        <p className="text-xs text-muted-foreground">courtesy of oura ring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <OuraStats delayStart={100} compact />
      </div>

      {/* Stats Grid */}
      <div className="mt-12 mb-4">
        <h2 className="font-semibold text-3xl mb-1 tracking-tighter text-foreground">
          everything else
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <AnimatedSection delay={350}>
          <StatCard
            title="days since pushing secrets to prod"
            value={daysClean}
            glowColor="magenta"
            animateNumber={true}
            compact
          />
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <StatCard
            title="energy drinks this month"
            value={drinksThisMonth}
            glowColor="green"
            animateNumber={true}
            subtitle="another white can monster could fix me"
            compact
          />
        </AnimatedSection>

        <AnimatedSection delay={450}>
          <StatCard
            title="meetings survived this week"
            value={meetings}
            glowColor="amber"
            animateNumber={true}
            subtitle="should we hop on a call"
            compact
          />
        </AnimatedSection>

        <AnimatedSection delay={500}>
          <GitHubStats />
        </AnimatedSection>

        <AnimatedSection delay={550}>
          <StatCard title="pets in my house" value={5} glowColor="purple" compact />
        </AnimatedSection>

        <AnimatedSection delay={600}>
          <StatCard
            title="years of student loan debt to pay off"
            value="&infin;"
            glowColor="magenta"
            compact
          />
        </AnimatedSection>

        <AnimatedSection delay={650}>
          <StatCard
            title="knee surgeries"
            value={5}
            subtitle="yea i am still training martial arts"
            glowColor="green"
            compact
          />
        </AnimatedSection>

        <AnimatedSection delay={700}>
          <StatCard
            title="days as #1 wife guy"
            value={daysMarried}
            glowColor="amber"
            compact
          />
        </AnimatedSection>

        <AnimatedSection delay={750}>
          <StatCard
            title="days suffering as a blue belt"
            value={daysSuffering}
            glowColor="purple"
            subtitle="i dont pull guard though"
            compact
          />
        </AnimatedSection>
      </div>

      {/* Footer note */}
      <div className="mt-12 mb-8 text-center">
        <p className="text-xs text-muted-foreground">
          github stats auto-refresh every 5 minutes. sleep stats refresh every
          15 minutes. manual stats updated when i remember.
        </p>
      </div>
    </div>
  )
}
