import Image from 'next/image'
import AnimatedSection from '../components/animated-section'
import ProjectItem from '../components/project-item'
import WorkProjectItem from '../components/work-project-item'
import { Separator } from '@/app/components/ui/separator'
import { GlassCard } from '@/app/components/ui/glass-card'
import { Badge } from '@/app/components/ui/badge'

export const metadata = {
  title: 'projects',
  description: 'stuff i work on',
}

const personalProject = [
  {
    name: 'todoist dashboard',
    description:
      "what do you mean it's weird to visualize your task tracking data",
    pill: 'live',
    pillColor: 'green',
    link: 'https://tasks.jakesciotto.com',
  },
  {
    name: 'easton+',
    preview: '/img/eastonplus.png',
    description:
      "drag and drop curriculum builder for jiu jitsu. legally you're not allowed to ask me about this",
    pill: 'in beta',
    pillColor: 'blue',
  },
  {
    name: 'easton mat lab',
    description:
      "internal video review platform for jiu jitsu coaches. no really i can't show you this either",
    pill: 'in beta',
    pillColor: 'blue',
  },
]

const workProject = [
  {
    name: 'cloudzero-date-filter',
    description:
      "built a chrome extension for users who wanted product functionality we don't have yet",
    pill: 'live',
    pillColor: 'green',
    link: 'https://chromewebstore.google.com/detail/gejpbillcbkknkgbpjdglcjallnhjloh?utm_source=item-share-cb',
  },
]

const anycost = {
  name: 'anycost templatizer',
  description: 'cli enabled custom cost adaptor solution',
  pill: 'new',
  pillColor: 'purple',
  link: 'https://github.com/jakesciotto/anycost-adaptor-template',
}

const connectorLogos = [
  {
    name: 'black forest labs',
    logo: '/img/ai/bfl.avif',
    pill: 'new',
    pillColor: 'red',
  },
  {
    name: 'leonardo.ai',
    logo: '/img/ai/leonardo',
    pill: 'new',
    pillColor: 'purple',
  },
  {
    name: 'runware.ai',
    logo: '/img/ai/runware.jpeg',
    pill: 'new',
    pillColor: 'purple',
  },
  {
    name: 'elevenlabs',
    logo: '/img/ai/elevenlabs.svg',
    pill: 'new',
    pillColor: 'purple',
  },
]

export default function Page() {
  return (
    <div className="mt-12 max-w-5xl px-4">
      <h1 className="font-semibold text-6xl mb-2 tracking-tighter gradient-text">
        projects
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        some things here that i work on
      </p>

      <AnimatedSection delay={60}>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
          personal
        </h2>
        <Separator className="mb-4 bg-border" />
      </AnimatedSection>
      <ul className="flex flex-col gap-3 mb-10">
        {personalProject.map((project, index) => (
          <AnimatedSection key={project.name} delay={100 + index * 80}>
            <ProjectItem project={project} />
          </AnimatedSection>
        ))}
      </ul>

      <AnimatedSection delay={300}>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
          work
        </h2>
        <p className="text-xs italic text-muted-foreground">
          (if you are my engineering team do not read this){' '}
        </p>
        <Separator className="mb-4 mt-4 bg-border" />
      </AnimatedSection>

      <ul className="flex flex-col gap-3">
        {workProject.map((project, index) => (
          <AnimatedSection key={project.name} delay={340 + index * 80}>
            <WorkProjectItem project={project} />
          </AnimatedSection>
        ))}
      </ul>

      <AnimatedSection delay={360}>
      <GlassCard glowColor="cyan" className="mt-4">
        <div className="grid grid-col-2 md:grid-cols-2 gap-3">
          <AnimatedSection delay={380} className="flex items-center">
            <span className="text-xs font-semibold italic text-muted-foreground">
              note: couldn't wait for dev time, had to build myself. working on
              open source-ifying. ship it. ship it all
            </span>
          </AnimatedSection>

          <AnimatedSection delay={420}>
            <WorkProjectItem project={anycost} />
          </AnimatedSection>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 items-stretch">
          {connectorLogos.map((connector, index) => (
            <AnimatedSection
              key={connector.name}
              delay={500 + index * 60}
              className="h-full"
            >
              <div className="glass-card glow-cyan p-3 flex flex-col items-center text-center h-full">
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                  <Image
                    src={connector.logo}
                    alt={connector.name}
                    width={48}
                    height={48}
                    className="object-contain rounded"
                  />
                  <span className="text-xs text-card-foreground font-medium">
                    {connector.name}
                  </span>
                </div>
                <Badge variant="neonPurple" className="mt-2">
                  {connector.pill}
                </Badge>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </GlassCard>
      </AnimatedSection>
    </div>
  )
}
