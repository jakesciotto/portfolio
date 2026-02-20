import AnimatedSection from './components/animated-section'
import InfoTooltip from './components/info-tooltip'
import TrackedLink from './components/tracked-link'
import { GlassCard, GlassCardTitle } from '@/app/components/ui/glass-card'

export default function Page() {
  return (
    <>
      {/* Header */}
      <div className="mt-12 max-w-3xl mx-auto">
        {/* Hero with radial glow */}
        <div className="relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-neon-cyan/5 dark:bg-neon-cyan/10 blur-3xl pointer-events-none" />
          <h1 className="font-semibold text-6xl mb-2 tracking-tighter gradient-text relative">
            jake sciotto
          </h1>
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
              className="shimmer-link cursor-pointer"
            >
              terminally online millenial
            </TrackedLink>{' '}
            by choice
          </p>
        </div>

        <section className="space-y-6 mt-8">
          {/* About */}
          <AnimatedSection delay={100}>
            <GlassCard glowColor="cyan">
              <GlassCardTitle>about (in order of importance)</GlassCardTitle>
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
            </GlassCard>
          </AnimatedSection>

          {/* Skills */}
          <AnimatedSection delay={200}>
            <GlassCard glowColor="magenta">
              <GlassCardTitle>technical capabilities</GlassCardTitle>
              <ul className="list-disc text-sm md:text-base pl-5 space-y-3 leading-relaxed text-card-foreground/80">
                <li className="transition-colors hover:text-card-foreground">
                  <b>cloud architecture:</b> serverless + event-driven, iac
                  tools, containerized workloads (i blew up an old macbook
                  putting microk8s on it)
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  <b>programming</b>: python, sql, javascript, java, c++, r - in
                  order of decreasing confidence
                  <InfoTooltip>
                    technologies include but are not limited to next.js/react,
                    node.js, express, vercel, tailwind, graphql, postgres,
                    redis, docker, github actions, terraform, oauth/jwt,
                    websockets - loOK AT THIS NERD, I BET YOU LOVE BOOKS
                  </InfoTooltip>
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  <b>stats</b>: regression (linear, logistic, regularized),
                  predictive modeling, time series analysis - 2x fantasy
                  football champion (model-driven, vibe-informed)
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  <b>machine learning</b>: scikit-learn, xgboost,
                  pytorch/tensorflow - tabular models, forecasting, and applied
                  ml
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  <b>data platforms & analytics</b>: snowflake/bigquery,
                  streaming pipelines, semantic layers, bi tooling - do not ever
                  ask me about a pie chart
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  <b>ai & llm systems</b>: cag, rag, vector dbs, prompt
                  versioning, caching, token-level cost controls for prod
                  workloads
                </li>
                <li className="transition-colors hover:text-card-foreground">
                  <b>finops</b>: framework, chargeback/showback models, genai
                  cost optimization (agentic / usage-aware){' '}
                </li>
              </ul>
            </GlassCard>
          </AnimatedSection>

          {/* Employment — outer glass container with inner role cards */}
          <AnimatedSection delay={300}>
            <GlassCard glowColor="cyan" className="space-y-4">
              <GlassCardTitle>
                employment history (selected highlights)
              </GlassCardTitle>

              <div className="glass-card glow-cyan p-4 space-y-1">
                <p className="font-semibold text-card-foreground">
                  staff technical account manager | cloudzero
                </p>
                <p className="text-xs text-muted-foreground italic">
                  staff &rarr; jan 2026 - present
                </p>
                <p className="text-xs text-muted-foreground italic">
                  senior &rarr; dec 2024 - dec 2025
                </p>
                <p className="mt-1 text-card-foreground/80 text-sm">
                  - nicknamed "mr figure shit out"
                </p>
                <p className="mt-1 text-card-foreground/80 text-sm">
                  - building bleeding edge finops solutions as the linchpin
                  between business and technology (trademark pending on this
                  phrase)
                </p>
              </div>

              <div className="glass-card glow-magenta p-4 space-y-1">
                <p className="font-semibold text-card-foreground">
                  enterprise implementation manager | arcadia
                </p>
                <p className="text-xs text-muted-foreground">
                  dec 2022 - dec 2024
                </p>
                <p className="mt-1 text-card-foreground/80 text-sm">
                  implemented healthcare software, coordinated cross-functional
                  teams, led training and change management at big boy scale -
                  what's the deal with healthcare
                </p>
              </div>

              <div className="glass-card glow-green p-4 space-y-1">
                <p className="font-semibold text-card-foreground">
                  senior implementation manager | carevalidate
                </p>
                <p className="text-xs text-muted-foreground">
                  dec 2020 - dec 2022
                </p>
                <p className="mt-1 text-card-foreground/80 text-sm">
                  led covid-19 solution implementations for hundreds of
                  thousands of users, designed creative solutions for evolving
                  requirements - should have invested in zoom
                </p>
              </div>

              <div className="glass-card glow-amber p-4 space-y-1 opacity-90">
                <p className="font-semibold text-card-foreground">
                  faculty | kennesaw state university
                </p>
                <p className="text-xs text-muted-foreground">
                  aug 2020 - dec 2022
                </p>
                <p className="mt-1 text-card-foreground/80 text-sm">
                  taught computing infrastructure and networking, consulted for
                  healthcare research - they gave me a podium and students
                  showed up
                </p>
              </div>

              <div className="glass-card glow-purple p-4 space-y-1 opacity-80">
                <p className="font-semibold text-card-foreground">
                  senior data analyst | vestra logistics
                </p>
                <p className="text-xs text-muted-foreground">
                  aug 2018 - dec 2019
                </p>
                <p className="mt-1 text-card-foreground/80 text-sm">
                  built power bi dashboards, developed transparent pricing
                  strategy, performed statistical analysis - made pretty charts
                  so people felt informed
                </p>
              </div>

              <div className="glass-card glow-cyan p-4 space-y-1 opacity-70">
                <p className="font-semibold text-card-foreground">
                  freelance web designer | rednax llc
                </p>
                <p className="text-xs text-muted-foreground">
                  2014 - 2017 (the before times)
                </p>
                <p className="mt-1 text-card-foreground/80 text-sm">
                  helped 10 small businesses launch websites - if you are
                  reading this i miss php
                </p>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Education */}
          <AnimatedSection delay={500}>
            <GlassCard glowColor="purple">
              <GlassCardTitle className="text-xl">education</GlassCardTitle>
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
                    className="shimmer-link cursor-pointer"
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
            </GlassCard>
          </AnimatedSection>
        </section>
      </div>
    </>
  )
}
