import PostHogClient from '../../posthog'

export async function GET(request) {
  const posthog = PostHogClient()
  const token = process.env.GITHUB_TOKEN

  // Get a distinct ID from headers if available, otherwise use anonymous
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  try {
    const now = new Date().toISOString()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          viewer {
            current: contributionsCollection(from: "${sevenDaysAgo}", to: "${now}") {
              totalCommitContributions
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
            previous: contributionsCollection(from: "${fourteenDaysAgo}", to: "${sevenDaysAgo}") {
              totalCommitContributions
            }
          }
        }`,
      }),
      next: { revalidate: 300 },
    })

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)

    const { data } = await res.json()
    const commits7d = data.viewer.current.totalCommitContributions
    const prevCommits7d = data.viewer.previous.totalCommitContributions

    // Extract daily breakdown from contribution calendar
    const allDays = data.viewer.current.contributionCalendar.weeks
      .flatMap((w) => w.contributionDays)
      .filter((d) => d.date >= sevenDaysAgo.split('T')[0])
      .sort((a, b) => a.date.localeCompare(b.date))

    const daily = allDays.map((d) => d.contributionCount)

    // Check if active in last 24 hours (any contributions today or yesterday)
    const todayStr = now.split('T')[0]
    const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const isActive = allDays.some(
      (d) => (d.date === todayStr || d.date === yesterdayStr) && d.contributionCount > 0
    )

    posthog.capture({
      distinctId: distinctId,
      event: 'github_stats_fetched',
      properties: {
        commits_7d: commits7d,
        prev_commits_7d: prevCommits7d,
        source: 'api',
      },
    })

    return Response.json({ commits7d, prevCommits7d, daily, isActive })
  } catch (error) {
    // Track error
    posthog.capture({
      distinctId: distinctId,
      event: 'github_stats_error',
      properties: {
        error_message: error?.message || 'Unknown error',
        source: 'api',
      },
    })


    return Response.json({ commits7d: 0 }, { status: 500 })
  }
}
