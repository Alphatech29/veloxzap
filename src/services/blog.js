import { apiFetch } from '../lib/api'
import { colors } from '../components/landing/theme'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const ACCENTS = [colors.gold, colors.champagne]

function accentFor(seed) {
  let hash = 0
  for (const char of String(seed)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return ACCENTS[hash % ACCENTS.length]
}

function initialsFor(name) {
  const words = (name || '').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 'VZ'
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function readTimeFor(html) {
  const words = stripHtml(html).split(' ').filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min`
}

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function resolveImageUrl(value) {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return `${API_BASE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

function normalizePost(row, featured = false) {
  return {
    id: row.slug,
    category: row.category || 'company',
    title: row.title,
    excerpt: row.meta_description || stripHtml(row.content).slice(0, 160),
    author: row.author_name || 'VeloxZap Team',
    initials: initialsFor(row.author_name),
    date: formatDate(row.created_at),
    readTime: readTimeFor(row.content),
    accent: accentFor(row.slug),
    featured,
    image: resolveImageUrl(row.featured_image),
    content: row.content || '',
    tags: row.tags || [],
  }
}

export async function getPublicBlogPosts() {
  const result = await apiFetch('/api/v1/general/blog', { method: 'GET' })
  if (!result.success) return { success: false, posts: [], message: result.message }
  const rows = result.data ?? []
  return { success: true, posts: rows.map((row, i) => normalizePost(row, i === 0)) }
}
