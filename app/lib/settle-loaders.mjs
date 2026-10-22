function withTimeout(promise, ms) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timed out after ${ms} ms`)), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

export async function settleLoaders(
  loaders,
  { timeoutMs = 3000, now = Date.now, onError = () => {} } = {},
) {
  const fetchedAt = now()
  const entries = await Promise.all(
    Object.entries(loaders).map(async ([key, load]) => {
      try {
        const data = await withTimeout(Promise.resolve().then(load), timeoutMs)
        return data == null ? null : [key, { data, fetchedAt }]
      } catch (error) {
        onError(key, error)
        return null
      }
    }),
  )
  return Object.fromEntries(entries.filter(Boolean))
}
