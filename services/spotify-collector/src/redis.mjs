export function createRedis({ url, token, fetchImpl = fetch }) {
  if (!url || !token)
    throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN are required')
  async function command(...args) {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    })
    if (!res.ok) throw new Error(`Redis ${args[0]} failed (${res.status})`)
    const data = await res.json()
    if (data.error) throw new Error(`Redis ${args[0]}: ${data.error}`)
    return data.result
  }
  return {
    get: (key) => command('GET', key),
    set: (key, value) => command('SET', key, value),
  }
}
