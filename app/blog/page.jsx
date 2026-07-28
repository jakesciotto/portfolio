import Link from 'next/link'
import { getAllPosts } from '@/app/lib/posts'

export const metadata = {
  title: 'words',
  description: 'writing, notes, and things worth keeping',
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso)
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .toLowerCase()
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="mt-12 max-w-3xl mx-auto px-6">
      <h1 className="font-semibold text-6xl mb-4 tracking-tighter text-foreground">
        words
      </h1>
      <p className="text-sm font-medium text-muted-foreground mb-8">
        writing, notes, and things worth keeping
      </p>

      {posts.length === 0 ? (
        <p className="text-sm text-foreground/80">
          nothing published yet. posts are on the way.
        </p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <time className="text-xs font-mono text-muted-foreground">
                  {formatDate(post.date)}
                </time>
                <h2 className="font-semibold text-2xl tracking-tight text-foreground group-hover:text-accent-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
