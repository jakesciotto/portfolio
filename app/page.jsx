export default function Page() {
  return (
    <div>
    <section>
      <h1 className="font-semibold text-6xl mb-2 tracking-tighter">jake sciotto</h1>
      <p className="font-semibold text-m tracking-tighter">boulder, co</p>
      <p className="text-xs text-neutral-500 mt-1">engineer by training, problem solver by trade, chaos agent by choice</p>
    </section>

    <section className="space-y-6 mt-8">

      {/* About - Dark card with hover lift */}
      <div className="relative flex flex-col bg-slate-800 shadow-md border border-slate-700 rounded-lg w-full max-w-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-600">
        <div className="p-5 md:p-6">
          <h4 className="mb-3 text-white text-2xl font-semibold">
            about (in order of importance)
          </h4>
          <ul className="list-disc text-sm md:text-base pl-4 space-y-2 text-neutral-200">
            <li className="transition-colors hover:text-white">brazilian jiu jitsu blue belt and kids department head</li>
            <li className="transition-colors hover:text-white">semi-neurotic highly technical problem solver</li>
            <li className="transition-colors hover:text-white">200-hour certified yoga teacher</li>
            <li className="transition-colors hover:text-white">"smartest guy i have ever met" - my wife</li>
            <li className="transition-colors hover:text-white">has two master's degrees - this debt is not going to pay for itself</li>
            <li className="transition-colors hover:text-white">alumni mentor at johns hopkins - tough explaining my 7 years in undergrad</li>
          </ul>
        </div>
      </div>

      {/* Skills - Light card with hover glow */}
       <div className="relative flex flex-col bg-transparent shadow-md border border-slate-200 dark:border-slate-7       
         +00 rounded-lg w-full max-w-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slat       
         +e-300 dark:hover:border-slate-600"> 
        <div className="p-5 md:p-6">
          <h4 className="mb-3 text-slate-900 dark:text-white text-2xl font-semibold">   
            technical capabilities*
          </h4>
          <ul className="list-disc text-sm md:text-base pl-4 space-y-2 text-slate-800 dark:text-neutral-200">
            <li className="transition-colors hover:text-slate-900 dark:hover:text-white">cloud: aws, azure, gcp - yes i know they're expensive, that's the point</li>
            <li className="transition-colors hover:text-slate-900 dark:hover:text-white">languages: python, sql, javascript, java, c++, r - in order of decreasing confidence</li>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">*i send emails for a living but i also build web apps in next/react</p>
            <li className="transition-colors hover:text-slate-900 dark:hover:text-white">ml frameworks: tensorflow, pytorch, keras, scikit-learn - 70% documentation, 30% intuition</li>
            <li className="transition-colors hover:text-slate-900 dark:hover:text-white">data: etl pipelines, wrangling, transformation</li>
            <li className="transition-colors hover:text-slate-900 dark:hover:text-white">visualization: looker, tableau, power bi - do not ever ask me about a pie chart</li>
            <li className="transition-colors hover:text-slate-900 dark:hover:text-white">finops: cost optimization, chargeback models, framework</li>
            <li className="transition-colors hover:text-slate-900 dark:hover:text-white">project management: agile, jira, trello - daily standup survivor</li>
          </ul>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">*stack overflow access required, six aws/finops certifications available upon request, results may vary</p>
        </div>
      </div>

      {/* Jobs - Border accent with hover expand */}
      <div className="relative flex flex-col border-l-4 border-slate-300 dark:border-slate-600 pl-4 md:pl-6 w-full max-w-2xl transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 hover:pl-5 md:hover:pl-7">
        <h4 className="mb-4 text-slate-800 dark:text-white text-2xl font-semibold">
          employment history (selected highlights)
        </h4>

        <div className="space-y-5 md:space-y-6 text-sm md:text-base">
          <div className="transition-all duration-200 hover:translate-x-1">
            <p className="font-semibold text-slate-900 dark:text-white">senior finops account manager | cloudzero</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">dec 2024 - present (currently employed, updating portfolio anyway)</p>
            <p className="mt-1 text-neutral-700 dark:text-neutral-300">managing enterprise cloud spend, partnering with c-suite to optimize costs, applying finops framework to solve expensive problems</p>
          </div>

          <div className="transition-all duration-200 hover:translate-x-1">
            <p className="font-semibold text-slate-900 dark:text-white">enterprise implementation manager | arcadia</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">dec 2022 - dec 2024</p>
            <p className="mt-1 text-neutral-700 dark:text-neutral-300">implemented healthcare software, coordinated cross-functional teams, led training and change management - basically made sure doctors could use the software</p>
          </div>

          <div className="transition-all duration-200 hover:translate-x-1">
            <p className="font-semibold text-slate-900 dark:text-white">senior implementation manager | carevalidate</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">dec 2021 - dec 2022</p>
            <p className="mt-1 text-neutral-700 dark:text-neutral-300">led covid-19 solution implementations for hundreds of thousands of users, designed creative solutions for evolving requirements - peak pandemic chaos coordination</p>
          </div>

          <div className="transition-all duration-200 hover:translate-x-1">
            <p className="font-semibold text-slate-900 dark:text-white">faculty - kennesaw state university</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">aug 2020 - dec 2022</p>
            <p className="mt-1 text-neutral-700 dark:text-neutral-300">taught computing infrastructure and networking, consulted for healthcare research - they gave me a podium and students showed up</p>
          </div>

          <div className="transition-all duration-200 hover:translate-x-1">
            <p className="font-semibold text-slate-900 dark:text-white">senior data analyst | vestra logistics</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">aug 2018 - dec 2019</p>
            <p className="mt-1 text-neutral-700 dark:text-neutral-300">built power bi dashboards, developed transparent pricing strategy, performed statistical analysis - made pretty charts so people felt informed</p>
          </div>

          <div className="transition-all duration-200 hover:translate-x-1 opacity-60 hover:opacity-100">
            <p className="font-semibold text-slate-900 dark:text-white">freelance web designer | rednax llc</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">2014 - 2017 (the before times)</p>
            <p className="mt-1 text-neutral-700 dark:text-neutral-300">helped 10 small businesses launch websites - learned that clients definitely know what they want until you build it</p>
          </div>
        </div>
      </div>

      {/* Education - Compact card with subtle hover */}
      <div className="relative flex flex-col bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg w-full max-w-2xl p-4 md:p-5 transition-all duration-300 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-600">
        <h4 className="mb-3 text-neutral-800 dark:text-neutral-100 text-xl font-semibold">education</h4>
        <div className="text-sm md:text-base space-y-2 text-neutral-700 dark:text-neutral-300">
          <p className="transition-colors hover:text-neutral-900 dark:hover:text-white"><span className="font-semibold">m.s. data science</span> - johns hopkins university (2020-2021)</p>
          <p className="transition-colors hover:text-neutral-900 dark:hover:text-white"><span className="font-semibold">m.s. information technology</span> - kennesaw state (2019) - solana fellowship recipient</p>
          <p className="transition-colors hover:text-neutral-900 dark:hover:text-white"><span className="font-semibold">b.s. information technology</span> - kennesaw state (2014-2018)</p>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-3">yes, two master's degrees. no, i don't know why either.</p>
      </div>

    </section>
    </div>
  )
}   