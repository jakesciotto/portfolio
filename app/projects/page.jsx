import Image from 'next/image'
import AnimatedSection from '../components/animated-section'

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
            <li className="relative group">
              <h4 className="mb-3 text-neutral-900 dark:text-white text-2xl font-semibold cursor-default flex items-center gap-3">
                <span className="w-fit">
                  {project.name}
                  <span className="ml-2 text-xs font-normal text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    preview
                  </span>
                </span>
                <span className="ml-auto text-[10px] font-medium uppercase tracking-widest text-neutral-500 border border-neutral-700 rounded-full px-2.5 py-0.5">
                  coming soon
                </span>
              </h4>
              <div className="absolute left-0 top-full z-10 pointer-events-none opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 ease-out">
                <Image
                  src={project.preview}
                  alt={`${project.name} preview`}
                  width={320}
                  height={200}
                  className="rounded-lg shadow-2xl border border-neutral-800"
                />
              </div>
            </li>
          </AnimatedSection>
        ))}
      </ul>
    </div>
  )
}
