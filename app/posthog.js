import { PostHog } from 'posthog-node'
import { after } from 'next/server'

let client = null

function getClient() {
  const key = process.env.POSTHOG_SERVER_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return null
  if (!client) {
    client = new PostHog(key, { host: process.env.NEXT_PUBLIC_POSTHOG_HOST })
  }
  return client
}

export function captureServer(event, properties = {}) {
  const posthog = getClient()
  if (!posthog) return
  posthog.capture({ distinctId: 'server_anonymous', event, properties })
  after(() => posthog.flush().catch(() => {}))
}
