import PostHogClient from '../../posthog'

export async function GET(request) {
  const posthog = PostHogClient()
  const token = process.env.GITHUB_TOKEN
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  // Get a distinct ID from headers if available, otherwise use anonymous
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  try {
    let allPushes = 0

    for (let page = 1; page <= 3; page++) {
      const res = await fetch(
        `https://api.github.com/users/jakesciotto/events?per_page=100&page=${page}`,
        { headers, next: { revalidate: 300 } }
      )
      if (!res.ok) break

      const events = await res.json()
      if (!Array.isArray(events) || events.length === 0) break

      allPushes += events.filter(
        (e) =>
          e.type === 'PushEvent' &&
          new Date(e.created_at).getTime() > sevenDaysAgo
      ).length

      // Stop if we've gone past 7 days
      const oldest = new Date(events[events.length - 1].created_at).getTime()
      if (oldest < sevenDaysAgo) break
    }

    // Track successful fetch
    posthog.capture({
      distinctId: distinctId,
      event: 'github_stats_fetched',
      properties: {
        commits_7d: allPushes,
        source: 'api',
      },
    })

    await posthog.shutdown()

    return Response.json({ commits7d: allPushes })
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

    await posthog.shutdown()

    return Response.json({ commits7d: 0 }, { status: 500 })
  }
}
