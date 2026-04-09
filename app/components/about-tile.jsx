const facts = [
  {
    label: 'bjj blue belt',
    detail: "all strength, no technique. won't pull guard",
  },
  {
    label: 'problem solver',
    detail: 'semi-neurotic, highly technical',
  },
  {
    label: 'coach',
    detail:
      'lacrosse & bjj since 2009 - the nick saban of youth sports (self-appointed)',
  },
  {
    label: 'yoga teacher',
    detail: '200-hour certified (for no reason)',
  },
  {
    label: 'over-educated',
    detail:
      "the debt from these two master's degrees is not going to pay for itself",
  },
]

function BeltIcon() {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      className="inline-block shrink-0"
    >
      <rect x="0" y="3" width="16" height="4" rx="1" fill="#2563eb" />
      <rect x="6" y="2" width="4" height="6" rx="0.5" fill="#1d4ed8" />
      <line
        x1="6"
        y1="8"
        x2="5"
        y2="10"
        stroke="#2563eb"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="8"
        x2="11"
        y2="10"
        stroke="#2563eb"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function AboutTile() {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground">
        about
      </h3>
      <p className="text-xs lowercase tracking-tight text-muted-foreground mb-4">
        in order of importance
      </p>

      <ol className="flex flex-col gap-3">
        {facts.map((fact, i) => (
          <li key={fact.label} className="flex items-baseline gap-2.5">
            <span className="text-xs font-mono text-muted-foreground/50 shrink-0 tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-foreground leading-tight inline">
                {fact.label}
                {fact.label === 'bjj blue belt' && (
                  <span className="ml-1.5 align-middle"><BeltIcon /></span>
                )}
              </p>
              <span className="text-xs text-muted-foreground ml-1.5">
                -- {fact.detail}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-auto pt-4">
        <div className="border-l border-accent-primary/20 pl-3">
          <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground/70 mb-1">
            wife review
          </p>
          <p className="text-sm italic text-foreground/90 leading-snug">
            "smartest guy i have ever met"
          </p>
        </div>
      </div>
    </div>
  )
}
