export function layoutColumns(items, { dim = 0.82 } = {}) {
  const values = items.map((it) => Number(it.value) || 0)
  const max = Math.max(0, ...values)
  const peakIndex = max > 0 ? values.indexOf(max) : -1
  return items.map((it, i) => {
    const v = values[i]
    const zero = v <= 0
    const heightPct = zero ? 0 : Math.max(3, (v / max) * 100)
    const peak = i === peakIndex
    const partial = !!it.partial
    return {
      label: it.label,
      text: it.text,
      heightPct,
      opacity: partial ? 0.3 : peak ? 1 : dim,
      peak,
      zero,
      partial,
    }
  })
}
