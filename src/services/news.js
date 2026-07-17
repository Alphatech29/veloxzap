import { apiFetch } from '../lib/api'

export async function getBlockchainNews() {
  const result = await apiFetch('/api/v1/general/news', { method: 'GET' })
  if (!result.success) {
    return { success: false, articles: [], message: result.message }
  }
  return { success: true, articles: result.data ?? [] }
}

export async function getArticleContent(url) {
  const result = await apiFetch(`/api/v1/general/news/article?url=${encodeURIComponent(url)}`, { method: 'GET' })
  if (!result.success) {
    return { success: false, article: null, message: result.message }
  }
  return { success: true, article: result.data ?? null }
}
