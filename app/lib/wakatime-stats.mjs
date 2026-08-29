export function mapWakaStats({ allTime, stats, summaries } = {}) {
  const totalSeconds = allTime?.data?.total_seconds || 0
  const s = stats?.data || null

  const languages = (s?.languages || []).slice(0, 8).map((l) => ({
    name: l.name,
    percent: l.percent,
    hours: Math.round(((l.total_seconds || 0) / 3600) * 10) / 10,
  }))

  const projects = [...(s?.projects || [])]
    .sort((a, b) => (b.total_seconds || 0) - (a.total_seconds || 0))
    .slice(0, 4)
    .map((p) => ({ name: p.name, text: p.text, seconds: p.total_seconds || 0 }))

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

  return {
    totalHours: totalSeconds > 0 ? Math.round(totalSeconds / 3600) : null,
    dailyAverage:
      s?.human_readable_daily_average ||
      s?.human_readable_daily_average_including_other_language ||
      null,
    weekTotal: s?.human_readable_total || null,
    bestDay: s?.best_day ? { date: s.best_day.date, text: s.best_day.text } : null,
    days,
    languages,
    projects,
    models,
  }
}
