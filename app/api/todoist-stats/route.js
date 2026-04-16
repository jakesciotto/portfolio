import { Redis } from '@upstash/redis'
import PostHogClient from '../../posthog'

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null

async function getAccessToken() {
  if (redis) {
    const stored = await redis.get('todoist_access_token').catch(() => null)
    if (stored) return { token: stored, hasOAuth: true }
  }
  const fallback = process.env.TODOIST_API_TOKEN
  if (fallback) return { token: fallback, hasOAuth: false }
  throw new Error('No Todoist token available')
}

async function fetchAllActiveTasks(token) {
  const tasks = []
  let cursor = null

  do {
    const url = new URL('https://api.todoist.com/api/v1/tasks')
    url.searchParams.set('limit', '200')
    if (cursor) url.searchParams.set('cursor', cursor)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error(`Tasks fetch failed (${res.status})`)

    const data = await res.json()
    tasks.push(...(data.results || []))
    cursor = data.next_cursor || null
  } while (cursor)

  return tasks
}

async function fetchCompletedTasks(token, since, until) {
  const url = new URL('https://api.todoist.com/api/v1/tasks/completed/by_completion_date')
  url.searchParams.set('since', since)
  url.searchParams.set('until', until)
  url.searchParams.set('limit', '200')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Completed tasks fetch failed (${res.status})`)

  const data = await res.json()
  return data.results || []
}

export async function GET(request) {
  const posthog = PostHogClient()
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  try {
    // Check Redis cache first
    if (redis) {
      const cached = await redis.get('todoist_stats_cache').catch(() => null)
      if (cached) {
        return Response.json(typeof cached === 'string' ? JSON.parse(cached) : cached)
      }
    }

    const { token, hasOAuth } = await getAccessToken()

    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const todayStart = `${today}T00:00:00Z`
    const todayEnd = `${today}T23:59:59Z`
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    const weekStart = `${sevenDaysAgo}T00:00:00Z`

    // Fetch active tasks (works with personal token or OAuth)
    const activeTasks = await fetchAllActiveTasks(token)
    const active = activeTasks.length
    const overdue = activeTasks.filter((t) => {
      if (!t.due?.date) return false
      return t.due.date < today
    }).length

    // Completed tasks require OAuth token
    let completedToday = null
    let completedThisWeek = null

    if (hasOAuth) {
      try {
        const [todayCompleted, weekCompleted] = await Promise.all([
          fetchCompletedTasks(token, todayStart, todayEnd),
          fetchCompletedTasks(token, weekStart, todayEnd),
        ])
        completedToday = todayCompleted.length
        completedThisWeek = weekCompleted.length
      } catch {
        // Graceful degradation -- completed stats unavailable
      }
    }

    const result = { active, overdue, completedToday, completedThisWeek }

    // Cache for 5 minutes
    if (redis) {
      await redis
        .set('todoist_stats_cache', JSON.stringify(result), { ex: 300 })
        .catch(() => {})
    }

    posthog.capture({
      distinctId,
      event: 'todoist_stats_fetched',
      properties: { active, overdue, completedToday, completedThisWeek, source: 'api' },
    })

    return Response.json(result)
  } catch (error) {
    posthog.capture({
      distinctId,
      event: 'todoist_stats_error',
      properties: { error_message: error?.message, source: 'api' },
    })

    return Response.json({
      active: null,
      overdue: null,
      completedToday: null,
      completedThisWeek: null,
    })
  }
}
