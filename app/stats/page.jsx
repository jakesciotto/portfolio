import { promises as fs } from 'fs'
import path from 'path'
import StatCard from '../components/stat-card'
import GitHubStats from '../components/github-stats'
import AnimatedSection from '../components/animated-section'

async function getStats() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'stats.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Failed to read stats.json:', error)
    return {
      energy_drinks_this_month: 0,
      days_since_secrets_to_prod: 0,
      meetings_survived_this_week: 0,
      pull_requests_merged_total: 0,
    }
  }
}

// jake writing this one personally
function daysSinceWedding() {
  const start = new Date('2021-09-25')
  return Math.floor((Date.now() - start) / (24 * 60 * 60 * 1000))
}

// jake writing this one too, which is fun
function daysSinceBlueBelt() {
  const start = new Date('2024-10-24')
  return Math.floor((Date.now() - start) / (24 * 60 * 60 * 1000))
}

export default async function StatsPage() {
  const stats = await getStats()
  const daysMarried = daysSinceWedding()
  const daysSuffering = daysSinceBlueBelt()

  return (
    <div className="mt-12 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-semibold text-6xl mb-2 tracking-tighter gradient-text">
          live stats
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          the numbers behind the chaos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Primary stats - top three filled cards */}
        <AnimatedSection delay={100}>
          <StatCard
            title="days since pushing secrets to prod"
            value={stats.days_since_secrets_to_prod}
            variant="primary"
            animateNumber={true}
          />
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <StatCard
            title="energy drinks this month"
            value={stats.energy_drinks_this_month}
            variant="primary"
            animateNumber={true}
          />
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <StatCard
            title="meetings survived this week"
            value={stats.meetings_survived_this_week}
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

        <AnimatedSection delay={350}>
          <StatCard
            title="days suffering as a blue belt"
            value={daysSuffering}
            variant="secondary"
          />
        </AnimatedSection>

        <AnimatedSection delay={350}>
          <StatCard
            title="years of student loan debt to pay off"
            value="∞"
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
