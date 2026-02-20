export const metadata = {
  title: 'privacy policy',
  description: 'privacy policy',
}

export default function PrivacyPage() {
  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <h1 className="font-semibold text-6xl mb-4 tracking-tighter gradient-text">
        privacy policy
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        last updated: february 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            what i collect
          </h2>
          <p>
            this site uses{' '}
            <a
              href="https://posthog.com"
              target="_blank"
              rel="noopener noreferrer"
              className="shimmer-link"
            >
              posthog
            </a>{' '}
            for analytics. it collects anonymous usage data like page views,
            clicks, and general session info. i use this to understand how people
            navigate the site — not to build a profile on you.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            cookies
          </h2>
          <p>
            posthog sets cookies to track sessions and distinguish unique
            visitors. no advertising cookies, no third-party trackers, no
            nonsense.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            personal information
          </h2>
          <p>
            i don't collect names, emails, or any personally identifiable
            information through this site. if you email me directly, that's
            between us and your email provider.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            third parties
          </h2>
          <p>
            the only third-party service with access to usage data is posthog.
            this site is hosted on{' '}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="shimmer-link"
            >
              vercel
            </a>
            , which may collect standard server logs (ip addresses, request
            metadata).
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            your rights
          </h2>
          <p>
            if you're in the eu, california, or anywhere else with privacy laws
            — you have the right to ask what data i have (spoiler: not much) and
            request its deletion. reach out at{' '}
            <a
              href="mailto:jake.sciotto@gmail.com"
              className="shimmer-link"
            >
              jake.sciotto@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            changes
          </h2>
          <p>
            i may update this policy if something changes. i'll update the date
            at the top. i won't send you a 47-page email about it.
          </p>
        </section>
      </div>
    </div>
  )
}
