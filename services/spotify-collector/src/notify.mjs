export function createNotifier({ topic, fetchImpl = fetch, log = console }) {
  let failing = false
  async function post(title, body) {
    if (!topic) return
    await fetchImpl(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      headers: { Title: title },
      body,
    }).catch((err) => log.error(`ntfy failed: ${err.message}`))
  }
  return {
    async failure(kind, message) {
      log.error(`${kind} failed: ${message}`)
      if (failing) return
      failing = true
      await post(`spotify-collector: ${kind} failed`, message)
    },
    async success(kind) {
      if (!failing) return
      failing = false
      await post(`spotify-collector: ${kind} recovered`, 'The job ran clean.')
    },
  }
}
