import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content/blog')

function toISO(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function readPost(slug) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    content,
    title: data.title ?? slug,
    date: toISO(data.date),
    excerpt: data.excerpt ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: data.draft === true,
  }
}

function getPostSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export function getAllPosts({ includeDrafts = false } = {}) {
  return getPostSlugs()
    .map(readPost)
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}

export function getPost(slug) {
  if (!getPostSlugs().includes(slug)) return null
  return readPost(slug)
}
