export const metadata = {
  title: 'terms of service',
  description: 'terms of service',
}

export default function TermsPage() {
  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <h1 className="font-semibold text-6xl mb-4 tracking-tighter gradient-text">
        terms of service
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        last updated: february 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            the basics
          </h2>
          <p>
            this is a personal portfolio website. by using it, you agree to
            these terms. if you don't agree, you're free to leave — no hard
            feelings.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            intellectual property
          </h2>
          <p>
            the site's source code is{' '}
            <a
              href="https://github.com/jakesciotto/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="shimmer-link"
            >
              mit licensed
            </a>
            . the written content, project descriptions, and personal branding
            are mine. don't pass off my work as yours — that's not cool.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            accuracy
          </h2>
          <p>
            i do my best to keep things accurate and up to date, but this is a
            personal site, not a legal filing. information is provided as-is
            with no warranties, express or implied.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            external links
          </h2>
          <p>
            this site links to external websites (github, credly, etc.). i'm
            not responsible for their content, privacy practices, or
            availability. clicking those links is on you.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            limitation of liability
          </h2>
          <p>
            this is a portfolio website. i am not liable for any damages arising
            from your use of this site. if browsing my resume somehow causes you
            harm, i'm genuinely sorry but also confused.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            changes
          </h2>
          <p>
            i may update these terms occasionally. continued use of the site
            means you accept the changes. i promise not to sneak anything weird
            in here.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-foreground mb-2">
            contact
          </h2>
          <p>
            questions? concerns? existential dread?{' '}
            <a
              href="mailto:jake.sciotto@gmail.com"
              className="shimmer-link"
            >
              jake.sciotto@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
