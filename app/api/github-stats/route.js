export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

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

      allPushes += events
        .filter((e) => e.type === 'PushEvent' && new Date(e.created_at).getTime() > sevenDaysAgo)
        .length

      // Stop if we've gone past 7 days
      const oldest = new Date(events[events.length - 1].created_at).getTime()
      if (oldest < sevenDaysAgo) break
    }

    return Response.json({ commits7d: allPushes })
  } catch {
    return Response.json({ commits7d: 0 }, { status: 500 })
  }
}
