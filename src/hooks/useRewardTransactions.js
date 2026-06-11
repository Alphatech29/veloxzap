import { useQuery } from '@tanstack/react-query'
import { fetchRewardTransactions } from '../lib/rewardRules'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

function normalize(row) {
  return {
    id:            row.id,
    type:          row.transaction_type ?? null,
    sourceType:    row.source_type ?? null,
    points:        Number(row.points ?? 0),
    expiresAt:     row.expires_at ?? null,
    createdAt:     row.created_at ?? null,
  }
}

export default function useRewardTransactions({ autoFetch = true } = {}) {
  const query = useQuery({
    queryKey: queryKeys.rewards.transactions,
    queryFn: () => unwrap(fetchRewardTransactions()),
    select: (data) => data.rows.map(normalize),
    enabled: autoFetch,
  })

  const transactions = query.data ?? []

  const totalPoints   = transactions.reduce((s, t) => s + t.points, 0)
  const earnedPoints  = transactions.filter(t => t.type === 'earn').reduce((s, t) => s + t.points, 0)
  const redeemedPoints = transactions.filter(t => t.type === 'redeem').reduce((s, t) => s + t.points, 0)

  return {
    transactions,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refresh: query.refetch,
    totalPoints, earnedPoints, redeemedPoints,
  }
}
