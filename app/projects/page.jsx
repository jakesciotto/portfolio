import AnimatedSection from '../components/animated-section'
import ProjectItem from '../components/project-item'
import WorkProjectItem from '../components/work-project-item'
import StatCard from '../components/stat-card'

export const metadata = {
  title: 'projects',
  description: 'stuff i work on',
}

const personalProject = [
  {
    name: 'easton+',
    preview: '/img/eastonplus.png',
    pill: 'in beta',
    pillColor: 'blue',
  },
  {
    name: 'todoist dashboard',
    preview: '/img/todoist-dashboard.png',
    description: 'personal todoist dashboard tracking my own metrics',
    pill: 'live',
    pillColor: 'green',
    link: 'https://tasks.jakesciotto.com',
  },
]

const workProject = [
  {
    name: 'anycost templatizer',
    preview: null,
    description: 'cli enabled custom cost adaptor solution',
    pill: 'new',
    pillColor: 'red',
  },
]

const connectors = [
  { name: 'black forest labs connector', pill: 'live', pillColor: 'green' },
  { name: 'leonardo.ai connector', pill: 'live', pillColor: 'green' },
  { name: 'runware.ai connector', pill: 'live', pillColor: 'green' },
  { name: 'elevenlabs connector', pill: 'live', pillColor: 'green' },
]

export default function Page() {
  return (
    <div className="mt-12 max-w-5xl px-4">
      <h1 className="font-semibold text-5xl mb-2 tracking-tighter gradient-text">
        projects
      </h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
        some things here
      </p>
      <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
        personal
      </h2>
      <hr className="border-neutral-200 dark:border-neutral-800 mb-4" />
      <ul className="flex flex-col gap-2 mb-10">
        {personalProject.map((project, index) => (
          <AnimatedSection key={project.name} delay={100 + index * 100}>
            <ProjectItem project={project} />
          </AnimatedSection>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
        work
      </h2>
      <hr className="border-neutral-200 dark:border-neutral-800 mb-4" />
      <p className="text-sm text-center text-neutral-500 dark:text-neutral-400 mb-2">
        shit is proprietary so it's like private or whatever
      </p>
      <ul className="flex flex-col gap-2">
        {workProject.map((project, index) => (
          <AnimatedSection key={project.name} delay={100 + index * 100}>
            <WorkProjectItem project={project} />
          </AnimatedSection>
        ))}
      </ul>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 mt-4">
        <p className="text-sm text-center text-neutral-500 dark:text-neutral-400 mb-2">
          custom cost ingestion solutions i built outside of my job description
        </p>
        <ul className="flex flex-col gap-1">
          {connectors.map((project, index) => (
            <AnimatedSection key={project.name} delay={300 + index * 100}>
              <WorkProjectItem project={project} />
            </AnimatedSection>
          ))}
        </ul>
      </div>
    </div>
  )
}
