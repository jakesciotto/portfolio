export function responseTime(responses, now = Date.now) {
  const times = responses
    .map((res) => Date.parse(res?.headers?.get('date') ?? ''))
    .filter(Number.isFinite)
  return times.length > 0 ? Math.min(...times) : now()
}

export function snapshotAt(payload, fallback = null) {
  const at = payload?.fetchedAt
  return Number.isFinite(at) ? at : fallback
}

export function newerEntry(shown, candidate) {
  if (!shown || !Number.isFinite(shown.at)) return candidate
  if (!Number.isFinite(candidate?.at) || candidate.at < shown.at) return shown
  return candidate
}
