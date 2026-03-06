import AnimatedSection from './components/animated-section'
import SectionTitle from './components/section-title'
import EmploymentTimeline from './components/employment-timeline'
import TrackedLink from './components/tracked-link'
import { Card, CardTitle } from '@/app/components/ui/card'
import HeroName from './components/hero-name'
import SkillTags from './components/skill-tags'

export default function Page() {
  return (
    <>
      {/* Hero */}
      <div className="mt-12 max-w-3xl mx-auto">
        <div className="relative">
          <HeroName />
          <p className="font-semibold text-sm tracking-tighter text-left">
            boulder, co
          </p>
          <p className="text-xs text-muted-foreground mt-1 relative">
            engineer by training, problem solver by trade,{' '}
            <TrackedLink
              href="/tweets"
              eventName="tweets_page_link_clicked"
              eventProperties={{
                link_text: 'terminally online millenial',
                location: 'header',
              }}
              className="underline decoration-accent-primary/40 hover:decoration-accent-primary transition-colors cursor-pointer"
            >
              terminally online millenial
            </TrackedLink>{' '}
            by choice
          </p>
        </div>

        {/* About */}
        <div className="mt-8">
          <SectionTitle text="about" />
          <AnimatedSection delay={100} className="relative z-10">
            <Card accent="primary">
              <CardTitle>(in order of importance)</CardTitle>
              <ul className="list-disc text-sm md:text-base pl-5 space-y-2 leading-relaxed text-card-foreground/80">
                <li className="transition-colors hover:text-card-foreground">
                  brazilian jiu jitsu blue belt & strongest man alive
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  semi-neurotic highly technical problem solver
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  coaching lacrosse & bjj since 2009 - the nick saban of youth
                  sports (self-appointed)
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  200-hour certified yoga teacher (for no reason)
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  "smartest guy i have ever met" - my wife
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  has two master's degrees - this debt is not going to pay for
                  itself
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  alumni mentor at johns hopkins - tough explaining my 7 years
                  in undergrad
                </li>
              </ul>
            </Card>
          </AnimatedSection>
        </div>

        {/* Skills */}
        <div className="mt-10">
          <SectionTitle text="skills" />
          <AnimatedSection delay={200} className="relative z-10">
            <Card accent="secondary">
              <SkillTags />
            </Card>
          </AnimatedSection>
        </div>

        {/* Employment */}
        <div className="mt-10">
          <SectionTitle text="work" />
          <AnimatedSection delay={300} className="relative z-10">
            <Card accent="primary">
              <CardTitle>employment history</CardTitle>
              <EmploymentTimeline />
            </Card>
          </AnimatedSection>
        </div>

        {/* Education */}
        <div className="mt-10">
          <SectionTitle text="education" />
          <AnimatedSection delay={500} className="relative z-10">
            <Card accent="tertiary">
              <div className="text-sm md:text-base space-y-2 text-card-foreground/80">
                <p className="transition-colors hover:text-card-foreground">
                  <span className="font-semibold">m.s. data science </span>
                  <TrackedLink
                    href="https://www.youtube.com/watch?v=bGH2d1jBJu8"
                    eventName="education_link_clicked"
                    eventProperties={{
                      school: 'johns_hopkins',
                      link_type: 'easter_egg',
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-accent-primary/40 hover:decoration-accent-primary transition-colors cursor-pointer"
                  >
                    - johns hopkins university
                  </TrackedLink>{' '}
                  (2020-2021)
                </p>
                <p className="transition-colors hover:text-card-foreground">
                  <span className="font-semibold">
                    m.s. information technology
                  </span>{' '}
                  - kennesaw state (2019) - solana fellowship recipient
                </p>
                <p className="transition-colors hover:text-card-foreground">
                  <span className="font-semibold">
                    b.s. information technology
                  </span>{' '}
                  - kennesaw state (2014-2018)
                </p>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </>
  )
}
