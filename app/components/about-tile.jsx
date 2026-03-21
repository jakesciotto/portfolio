const facts = [
  {
    label: 'bjj blue belt',
    detail: "all strength, no technique. won't pull guard",
  },
  { label: 'problem solver', detail: 'semi-neurotic, highly technical' },
  {
    label: 'coach',
    detail:
      'lacrosse & bjj since 2009 - the nick saban of youth sports (self-appointed)',
  },
  { label: 'yoga teacher', detail: '200-hour certified (for no reason)' },

  {
    label: 'over-educated',
    detail:
      "the debt from these two master's degrees is not going to pay for itself",
  },
  { label: 'wife review', detail: '"smartest guy i have ever met"' },
]

export default function AboutTile() {
  return (
    <div>
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-1">
        about
      </h3>
      <p className="text-[12px] lowercase tracking-tight text-muted-foreground mb-2">
        (in order of importance)
      </p>
      <div className="grid grid-cols-2 gap-2">
        {facts.map((fact, i) => (
          <div
            key={fact.label}
            className={`bg-background/50 rounded-lg p-2${
              i === facts.length - 1 && facts.length % 2 !== 0
                ? ' col-span-2'
                : ''
            }`}
          >
            <p className="text-xs font-semibold text-foreground leading-snug">
              {fact.label}
            </p>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
              {fact.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
