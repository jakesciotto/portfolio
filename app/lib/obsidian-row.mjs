export const TIERS = [
  { key: 'now', accent: 'secondary' },
  { key: 'next', accent: 'primary' },
  { key: 'waiting', accent: 'amber' },
  { key: 'blocked', accent: 'red' },
  { key: 'someday', accent: 'violet' },
  { key: 'backlog', accent: 'tertiary' },
]

export function tierCards(stats) {
  const active = Number(stats?.active) || 0
  const tiers = stats?.tiers || {}
  return TIERS.map(({ key, accent }) => {
    const count = Number(tiers[key]) || 0
    const share = active > 0 ? count / active : 0
    return { key, accent, count, share, pct: Math.round(share * 100), zero: count === 0 }
  })
}
