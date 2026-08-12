import { useQuery } from '@tanstack/react-query'
import { getArticleContent } from '../services/news'
import { queryKeys } from '../lib/queryKeys'

const STRIPPED_LINK_TEXT = /view full report/i

function stripUnwantedLinks(html) {
  if (!html) return html
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('a').forEach(a => {
    if (!STRIPPED_LINK_TEXT.test(a.textContent)) return
    const parent = a.parentElement
    a.remove()
    if (parent && parent !== doc.body && !parent.textContent.trim() && !parent.querySelector('img')) {
      parent.remove()
    }
  })
  return doc.body.innerHTML
}

export default function useArticleContent(url) {
  const query = useQuery({
    queryKey: queryKeys.news.article(url),
    queryFn: () => getArticleContent(url),
    enabled: Boolean(url),
    staleTime: 30 * 60_000,
    retry: 1,
  })

  const result = query.data
  const article = result?.success ? result.article : null
  return {
    article: article ? { ...article, content: stripUnwantedLinks(article.content) } : null,
    loading: query.isLoading,
    error: result && !result.success ? result.message : null,
  }
}
