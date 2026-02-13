import StatsBar from './components/stats-bar'
import AnimatedSection from './components/animated-section'
import InfoTooltip from './components/info-tooltip'

export default function Page() {
  return (
    <>
      <StatsBar />

      {/* Header */}
      <div className="mt-12 max-w-2xl mx-auto">
        <h1 className="font-semibold text-6xl mb-2 tracking-tighter gradient-text">
          jake sciotto
        </h1>
        <p className="w-1/2 font-semibold text-sm tracking-tighter">
          boulder, co
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          engineer by training, problem solver by trade,{' '}
          <a
            href="/tweets"
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            terminally online millenial
          </a>{' '}
          by choice
        </p>

        <section className="space-y-6 mt-8">
          {/* About section
           // TODO: add stats cards to top section here and maybe make them smaller
           */}

          <AnimatedSection delay={100}>
            <div className="relative flex flex-col bg-slate-800 shadow-md border border-slate-700 rounded-lg w-full max-w-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-600">
              <div className="p-5 md:p-6">
                <h4 className="mb-3 text-white text-2xl font-semibold">
                  about (in order of importance)
                </h4>
                <ul className="list-disc text-sm md:text-base pl-5 space-y-2 leading-relaxed text-neutral-200">
                  <li className="transition-colors hover:text-white">
                    brazilian jiu jitsu blue belt & strongest man alive
                  </li>
                  <li className="transition-colors hover:text-white">
                    semi-neurotic highly technical problem solver
                  </li>
                  <li className="transition-colors hover:text-white">
                    200-hour certified yoga teacher
                  </li>
                  <li className="transition-colors hover:text-white">
                    "smartest guy i have ever met" - my wife
                  </li>
                  <li className="transition-colors hover:text-white">
                    has two master's degrees - this debt is not going to pay for
                    itself
                  </li>
                  <li className="transition-colors hover:text-white">
                    alumni mentor at johns hopkins - tough explaining my 7 years
                    in undergrad
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>

          {/* Skills - Card with border */}
          <AnimatedSection delay={200}>
            <div className="relative flex flex-col bg-transparent shadow-md border border-slate-200 dark:border-slate-700 rounded-lg w-full max-w-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-600">
              <div className="p-5 md:p-6">
                <h4 className="mb-3 text-slate-900 dark:text-white text-2xl font-semibold">
                  technical capabilities*
                </h4>
                <ul className="list-disc text-sm md:text-base pl-5 space-y-3 leading-relaxed text-slate-800 dark:text-neutral-200">
                  <li className="transition-colors hover:text-slate-900 dark:hover:text-white">
                    cloud architecture: serverless + event-driven, iac tools,
                    containerized workloads (i blew up an old macbook putting
                    microk8s on it)
                  </li>
                  <li className="transition-colors hover:text-slate-900 dark:hover:text-white">
                    programming: python, sql, javascript, java, c++, r - in
                    order of decreasing confidence
                    <InfoTooltip>
                      technologies include but are not limited to next.js/react,
                      node.js, express, vercel, tailwind, graphql, postgres,
                      redis, docker, github actions, terraform, oauth/jwt,
                      websockets - loOK AT THIS NERD, I BET YOU LOVE BOOKS
                    </InfoTooltip>
                  </li>
                  <li className="transition-colors hover:text-slate-900 dark:hover:text-white">
                    stats: regression (linear, logistic, regularized),
                    predictive modeling, time series analysis - 2x fantasy
                    football champion (model-driven, vibe-informed)
                  </li>
                  <li className="transition-colors hover:text-slate-900 dark:hover:text-white">
                    machine learning: scikit-learn, xgboost, pytorch/tensorflow
                    - tabular models, forecasting, and applied ml
                  </li>
                  <li className="transition-colors hover:text-slate-900 dark:hover:text-white">
                    data platforms & analytics: snowflake/bigquery, streaming
                    pipelines, semantic layers, bi tooling - do not ever ask me
                    about a pie chart
                  </li>
                  <li className="transition-colors hover:text-slate-900 dark:hover:text-white">
                    ai & llm systems: vector dbs, prompt versioning, caching,
                    token-level cost controls for prod workloads
                  </li>
                  <li className="transition-colors hover:text-slate-900 dark:hover:text-white">
                    finops: framework, chargeback/showback models, genai cost
                    optimization (agentic / usage-aware){' '}
                  </li>
                </ul>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  *six aws/finops certifications available upon request, results
                  may vary
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Jobs - Border accent with hover expand */}
          <AnimatedSection delay={300}>
            <div className="relative flex flex-col border-l-4 border-slate-300 dark:border-slate-600 pl-4 md:pl-6 w-full max-w-2xl transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 hover:pl-5 md:hover:pl-7">
              <h4 className="mb-4 text-slate-800 dark:text-white text-2xl font-semibold">
                employment history (selected highlights)
              </h4>

              <div className="space-y-5 md:space-y-6 text-sm md:text-base">
                <div className="transition-all duration-200 hover:translate-x-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    staff technical account manager | cloudzero
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                    staff &rarr; jan 2026 - present
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                    senior &rarr; dec 2024 - dec 2025
                  </p>
                  <p className="mt-1 text-neutral-700 dark:text-neutral-300">
                    - nicknamed "mr figure shit out"
                  </p>
                  <p className="mt-1 text-neutral-700 dark:text-neutral-300">
                    - building bleeding edge finops solutions as the linchpin
                    between business and technology (trademark pending on this
                    phrase)
                  </p>
                </div>

                <div className="transition-all duration-200 hover:translate-x-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    enterprise implementation manager | arcadia
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    dec 2022 - dec 2024
                  </p>
                  <p className="mt-1 text-neutral-700 dark:text-neutral-300">
                    implemented healthcare software, coordinated
                    cross-functional teams, led training and change management
                    at big boy scale - what's the deal with healthcare
                  </p>
                </div>

                <div className="transition-all duration-200 hover:translate-x-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    senior implementation manager | carevalidate
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    dec 2020 - dec 2022
                  </p>
                  <p className="mt-1 text-neutral-700 dark:text-neutral-300">
                    led covid-19 solution implementations for hundreds of
                    thousands of users, designed creative solutions for evolving
                    requirements - should have invested in zoom
                  </p>
                </div>

                <div className="transition-all duration-200 hover:translate-x-1 opacity-80 hover:opacity-100">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    faculty | kennesaw state university
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    aug 2020 - dec 2022
                  </p>
                  <p className="mt-1 text-neutral-700 dark:text-neutral-300">
                    taught computing infrastructure and networking, consulted
                    for healthcare research - they gave me a podium and students
                    showed up
                  </p>
                </div>

                <div className="transition-all duration-200 hover:translate-x-1 opacity-60 hover:opacity-100">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    senior data analyst | vestra logistics
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    aug 2018 - dec 2019
                  </p>
                  <p className="mt-1 text-neutral-700 dark:text-neutral-300">
                    built power bi dashboards, developed transparent pricing
                    strategy, performed statistical analysis - made pretty
                    charts so people felt informed
                  </p>
                </div>

                <div className="transition-all duration-200 hover:translate-x-1 opacity-40 hover:opacity-100">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    freelance web designer | rednax llc
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    2014 - 2017 (the before times)
                  </p>
                  <p className="mt-1 text-neutral-700 dark:text-neutral-300">
                    helped 10 small businesses launch websites - if you are
                    reading this i miss php
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Education - Compact card with subtle hover */}
          <AnimatedSection delay={400}>
            <div className="relative flex flex-col bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg w-full max-w-2xl p-4 md:p-5 transition-all duration-300 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-600">
              <h4 className="mb-3 text-neutral-800 dark:text-neutral-100 text-xl font-semibold">
                education
              </h4>
              <div className="text-sm md:text-base space-y-2 text-neutral-700 dark:text-neutral-300">
                <p className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                  <span className="font-semibold">m.s. data science </span>
                  <a
                    href="https://www.youtube.com/watch?v=bGH2d1jBJu8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-inherit no-underline hover:text-inherit"
                  >
                    - johns hopkins university
                  </a>{' '}
                  (2020-2021)
                </p>
                <p className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                  <span className="font-semibold">
                    m.s. information technology
                  </span>{' '}
                  - kennesaw state (2019) - solana fellowship recipient
                </p>
                <p className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                  <span className="font-semibold">
                    b.s. information technology
                  </span>{' '}
                  - kennesaw state (2014-2018)
                </p>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </div>
    </>
  )
}
