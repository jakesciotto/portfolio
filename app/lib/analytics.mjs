export const QUEUE_LIMIT = 50

export function createAnalytics() {
  let client = null
  const queue = []

  return {
    capture(event, properties) {
      if (client) {
        client.capture(event, properties)
        return
      }
      if (queue.length < QUEUE_LIMIT) queue.push([event, properties])
    },
    attach(posthog) {
      client = posthog
      for (const [event, properties] of queue.splice(0)) {
        posthog.capture(event, properties)
      }
    },
    pending() {
      return queue.length
    },
  }
}

const analytics = createAnalytics()

export const capture = analytics.capture
export const attachAnalytics = analytics.attach
