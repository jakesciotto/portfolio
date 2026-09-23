import { Badge } from './ui/badge'

const facts = [
  {
    label: 'bjj blue belt',
    detail: "all strength, no technique. won't pull guard",
    badge: 'verified',
    tone: 'tertiary',
    // icon: <BeltIcon />,
  },
  {
    label: 'problem solver',
    detail: "just give me about thirty minutes i'll figure something out",
    badge: 'verified',
    tone: 'tertiary',
  },
  {
    label: 'coach',
    detail: 'i have been called the nick saban of youth sports',
    badge: 'disputed',
    tone: 'amber',
  },
  {
    label: 'over-educated',
    detail: "let's just say i will never pay off my student loan debt",
    badge: 'verified',
    tone: 'tertiary',
  },
  {
    label: 'sweaty',
    detail: "it's always shorts weather baby",
    badge: 'verified',
    tone: 'tertiary',
  },
  {
    label: 'horrible bowler',
    detail: 'what do you want from me',
    badge: 'self-reported',
    tone: 'muted',
  },
  {
    label: 'afraid of horses',
    detail: 'they are too big to be trusted',
    badge: 'verified',
    tone: 'tertiary',
  },
  {
    label: 'wife review',
    detail: '"smartest guy i have ever met"',
    badge: 'biased source',
    tone: 'violet',
    quote: true,
  },
]

function BeltIcon() {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      className="inline-block shrink-0"
      aria-hidden="true"
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

function FactCard({ fact, index }) {
  return (
    <li className="fact-card relative flex min-w-0 flex-col px-3 py-2.5">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-2.25 right-2.75 font-mono text-2xl font-medium leading-none tracking-[-0.04em] tabular-nums text-foreground/20"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <h4 className="inline-flex min-w-0 items-center gap-1.5 pr-10 text-sm leading-4.5 font-semibold tracking-tight text-foreground">
        {fact.label}
        {fact.icon}
      </h4>
      <p
        className={`mt-2 text-xs leading-4 font-medium tracking-[-0.2px] ${
          fact.quote ? 'text-foreground/90 italic' : 'text-muted-foreground'
        }`}
      >
        {fact.detail}
      </p>
      <Badge
        variant={fact.tone}
        className="mt-2 h-4 self-end rounded px-1.5 py-0 font-mono text-[9.5px] tracking-[0.04em]"
      >
        {fact.badge}
      </Badge>
    </li>
  )
}

export default function AboutTile() {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-3">
        about
      </h3>

      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {facts.map((fact, i) => (
          <FactCard key={fact.label} fact={fact} index={i} />
        ))}
      </ol>
    </div>
  )
}
