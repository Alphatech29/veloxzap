import { useQuery } from '@tanstack/react-query'
import { getBlockchainNews } from '../services/news'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

export default function useBlockchainNews() {
  const query = useQuery({
    queryKey: queryKeys.news.blockchain,
    queryFn: () => unwrap(getBlockchainNews()),
    select: (data) => data.articles,
    staleTime: 5 * 60_000,
  })

  return {
    articles: query.data ?? [],
    loading: query.isLoading,
  }
}
