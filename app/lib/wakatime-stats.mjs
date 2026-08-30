const NOISE = new Set(['Other', 'Diff', 'Text', 'TSConfig', 'CSV', 'JSON', 'INI'])

function pickLanguages(stats) {
  return (stats?.data?.languages || [])
    .filter((l) => !NOISE.has(l.name))
    .slice(0, 6)
    .map((l) => ({ name: l.name, percent: Math.round(l.percent * 10) / 10 }))
}

export function mapWakaStats({ allTime, stats, year, summaries } = {}) {
  const totalSeconds = allTime?.data?.total_seconds || 0
  const s = stats?.data || null

  const models = (s?.ai_model_breakdown || [])
    .filter((m) => (m.lines || 0) > 0)
    .sort((a, b) => b.lines - a.lines)
    .slice(0, 4)
    .map((m) => ({ name: m.name, lines: m.lines }))

  const days = (summaries?.data || []).map((d) => ({
    date: d.range?.date,
    seconds: d.grand_total?.total_seconds || 0,
    text: d.grand_total?.text || '0 secs',
  }))

  const yearLanguages = pickLanguages(year)

  return {
    totalHours: totalSeconds > 0 ? Math.round(totalSeconds / 3600) : null,
    dailyAverage:
      s?.human_readable_daily_average ||
      s?.human_readable_daily_average_including_other_language ||
      null,
    weekTotal: s?.human_readable_total || null,
    bestDay: s?.best_day ? { date: s.best_day.date, text: s.best_day.text } : null,
    days,
    languages: yearLanguages.length ? yearLanguages : pickLanguages(stats),
    languagesRange: yearLanguages.length ? 'last 12 months' : 'last 7 days',
    models,
  }
}
