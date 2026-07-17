import { useQuery } from '@tanstack/react-query'
import { getArticleContent } from '../services/news'
import { queryKeys } from '../lib/queryKeys'

export default function useArticleContent(url) {
  const query = useQuery({
    queryKey: queryKeys.news.article(url),
    queryFn: () => getArticleContent(url),
    enabled: Boolean(url),
    staleTime: 30 * 60_000,
    retry: 1,
  })

  const result = query.data
  return {
    article: result?.success ? result.article : null,
    loading: query.isLoading,
    error: result && !result.success ? result.message : null,
  }
}
