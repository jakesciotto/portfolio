import { attachAnalytics } from './app/lib/analytics.mjs'

function loadPostHog() {
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      defaults: '2026-01-30',
      capture_exceptions: true,
    })
    attachAnalytics(posthog)
  })
}

if (process.env.NODE_ENV === 'production') {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadPostHog, { timeout: 3000 })
  } else {
    setTimeout(loadPostHog, 1500)
  }
}
