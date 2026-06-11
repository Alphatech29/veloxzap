import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { purchaseAirtime, getRecentAirtimeNumbers } from '../lib/airtime'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

export const PRESETS = [50, 100, 200, 500, 1000, 2000]

export const CASHBACK_RATE = 0.00

function mutationError(mutation, fallback) {
  return mutation.data && !mutation.data.success
    ? (mutation.data.message || fallback)
    : null
}

export default function useAirtime({ autoRecent = true } = {}) {
  const queryClient = useQueryClient()

  const recentQuery = useQuery({
    queryKey: queryKeys.airtime.recent,
    queryFn: () => unwrap(getRecentAirtimeNumbers()),
    select: (data) => data.numbers,
    enabled: autoRecent,
  })

  const buyMutation = useMutation({
    mutationFn: (payload) => purchaseAirtime(payload),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.airtime.recent })
        queryClient.invalidateQueries({ queryKey: queryKeys.wallet })
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.recent })
      }
    },
  })

  const buy = useCallback((payload) => buyMutation.mutateAsync(payload), [buyMutation])

  const reset = useCallback(() => {
    buyMutation.reset()
  }, [buyMutation])

  return {
    recentNumbers: recentQuery.data ?? [],
    recentLoading: recentQuery.isLoading,

    buying: buyMutation.isPending,
    buyError: mutationError(buyMutation, 'Airtime purchase failed.'),

    buy,
    refreshRecent: recentQuery.refetch,
    reset,
  }
}
