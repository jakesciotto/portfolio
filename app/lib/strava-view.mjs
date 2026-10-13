export function breakdownColumns(breakdown = []) {
  const rows = [...breakdown].sort((a, b) => b.count - a.count)
  const max = rows.length ? rows[0].count : 0
  const half = Math.ceil(rows.length / 2)
  return { max, columns: [rows.slice(0, half), rows.slice(half)] }
}
