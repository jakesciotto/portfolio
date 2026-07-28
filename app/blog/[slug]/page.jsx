import { notFound } from 'next/navigation'
import Link from 'next/link'
import { compileMDX } from 'next-mdx-remote/rsc'
import { getAllPosts, getPost } from '@/app/lib/posts'
import { mdxComponents } from '@/app/components/mdx-components'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post || post.draft) return {}
  return { title: post.title, description: post.excerpt }
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

export default async function PostPage({ params }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post || post.draft) notFound()

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
  })

  return (
    <article className="mt-12 max-w-3xl mx-auto px-6">
      <Link
        href="/blog"
        className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
      >
        back to words
      </Link>
      <h1 className="font-semibold text-5xl mt-6 mb-3 tracking-tighter text-foreground">
        {post.title}
      </h1>
      <time className="block text-sm font-medium text-muted-foreground mb-10">
        {formatDate(post.date)}
      </time>
      <div className="text-[0.95rem] leading-relaxed text-foreground/80">
        {content}
      </div>
    </article>
  )
}
