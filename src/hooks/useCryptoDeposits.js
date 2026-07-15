import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getCryptoDepositHistory } from '../services/crypto'
import { useAuth } from './useAuth'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

const PAGE_SIZE = 20

export default function useCryptoDeposits({ auto = true } = {}) {
  const { isAuthenticated } = useAuth()

  const query = useInfiniteQuery({
    queryKey: queryKeys.crypto.deposits,
    queryFn: ({ pageParam }) => unwrap(getCryptoDepositHistory({ page: pageParam, pageSize: PAGE_SIZE })),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.deposits.length === PAGE_SIZE ? allPages.length + 1 : undefined),
    enabled: auto && isAuthenticated,
  })

  const deposits = useMemo(
    () => (query.data?.pages ?? []).flatMap(page => page.deposits),
    [query.data]
  )

  return {
    deposits,
    loading: query.isLoading,
    loadingMore: query.isFetchingNextPage,
    hasMore: Boolean(query.hasNextPage),
    loadMore: query.fetchNextPage,
    error: query.error,
  }
}
