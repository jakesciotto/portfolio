import CertStrip from './cert-strip'

const DEGREES = [
  {
    title: 'm.s. data science',
    school: 'johns hopkins university (2020-2021)',
    accent: 'bg-accent-primary',
    coursework: [
      'Machine Learning',
      'Statistical Methods',
      'Data Visualization',
      'Bayesian Statistics',
    ],
  },
  {
    title: 'm.s. information technology',
    school: 'kennesaw state (2019)',
    accent: 'bg-accent-secondary',
    coursework: [
      'Cloud Architecture',
      'Database Systems',
      'Network Security',
      'IT Strategy',
    ],
  },
  {
    title: 'b.s. information technology',
    school: 'kennesaw state (2014-2018)',
    accent: 'bg-accent-tertiary',
    coursework: [
      'Data Structures',
      'Operating Systems',
      'Software Engineering',
      'Web Development',
    ],
  },
]

export default function EducationTile() {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-3">
        education
      </h3>
      <div className="relative pl-4 mb-5">
        <div className="absolute left-[3px] top-1 bottom-1 w-px bg-border-strong" />
        <div className="space-y-4">
          {DEGREES.map((d) => (
            <div key={d.title} className="relative">
              <div className={`absolute -left-4 top-[5px] h-2 w-2 rounded-full ${d.accent} ring-2 ring-card`} />
              <p className="text-sm font-semibold text-foreground">
                {d.title}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {d.school}
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {d.coursework.map((c) => (
                  <span
                    key={c}
                    className="text-[10px] font-mono text-muted-foreground font-medium border border-border-strong rounded px-1.5 py-0.5"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <CertStrip />
    </div>
  )
}
