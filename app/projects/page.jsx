import AnimatedSection from '../components/animated-section'
import ProjectItem from '../components/project-item'

export const metadata = {
  title: 'projects',
  description: 'stuff i work on',
}

const projects = [
  { name: 'easton+', preview: '/img/eastonplus.png' },
  { name: 'todoist dashboard', preview: '/img/todoist-dashboard.png' },
]

export default function Page() {
  return (
    <div className="mt-12 max-w-5xl px-4">
      <h1 className="font-semibold text-5xl mb-2 tracking-tighter gradient-text">
        projects
      </h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
        idk under construction or whatever
      </p>
      <ul className="flex flex-col gap-2">
        {projects.map((project, index) => (
          <AnimatedSection key={project.name} delay={100 + index * 100}>
            <ProjectItem project={project} />
          </AnimatedSection>
        ))}
      </ul>
    </div>
  )
}
