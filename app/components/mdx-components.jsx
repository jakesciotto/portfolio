import Link from 'next/link'

const linkClass =
  'underline decoration-accent-primary/40 hover:decoration-accent-primary transition-colors'

function Anchor({ href = '', children, ...props }) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      {...props}
    >
      {children}
    </a>
  )
}

export const mdxComponents = {
  h2: (props) => (
    <h2
      className="font-semibold text-2xl tracking-tight text-foreground mt-10 mb-3"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="font-semibold text-xl tracking-tight text-foreground mt-8 mb-2"
      {...props}
    />
  ),
  p: (props) => <p className="mb-5" {...props} />,
  a: Anchor,
  ul: (props) => <ul className="list-disc pl-5 mb-5 space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal pl-5 mb-5 space-y-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-accent-primary/40 pl-4 italic text-muted-foreground my-6"
      {...props}
    />
  ),
  hr: () => <hr className="border-border my-8" />,
  img: (props) => <img className="rounded-lg my-6 max-w-full" {...props} />,
  code: ({ children, ...props }) => {
    const inline = typeof children === 'string' && !children.includes('\n')
    return inline ? (
      <code
        className="font-mono text-[0.85em] bg-foreground/[0.06] rounded px-1.5 py-0.5"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code className="font-mono text-sm" {...props}>
        {children}
      </code>
    )
  },
  pre: (props) => (
    <pre
      className="font-mono text-sm bg-foreground/[0.04] border border-border rounded-lg p-4 overflow-x-auto my-6"
      {...props}
    />
  ),
}
