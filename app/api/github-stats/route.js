export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    const res = await fetch(
      'https://api.github.com/users/jakesciotto/events?per_page=100',
      { headers, next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error('GitHub API error')

    const events = await res.json()
    if (!Array.isArray(events)) throw new Error('Invalid response')

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    const pushes7d = events
      .filter((e) => e.type === 'PushEvent' && new Date(e.created_at).getTime() > sevenDaysAgo)
      .length

    return Response.json({ commits7d: pushes7d })
  } catch {
    return Response.json({ commits7d: 0 }, { status: 500 })
  }
}
