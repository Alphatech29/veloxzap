import { useQuery } from '@tanstack/react-query'
import { fetchReferrals } from '../services/referrals'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

function normalize(row) {
  return {
    id:         String(row.id),
    full_name:  row.full_name ?? null,
    code:       row.referral_code_used ?? null,
    status:     row.reward_status ?? 'pending',
    is_claimed: Number(row.is_claimed ?? 0),
    reward:     Number(row.reward_amount ?? 0),
    createdAt:  row.created_at ?? null,
  }
}

export default function useReferrals({ autoFetch = true } = {}) {
  const query = useQuery({
    queryKey: queryKeys.referrals,
    queryFn: () => unwrap(fetchReferrals()),
    select: (data) => data.rows.map(normalize),
    enabled: autoFetch,
  })

  const referrals = query.data ?? []

  const total          = referrals.length
  const completed      = referrals.filter(r => r.status === 'paid').length
  const pending        = referrals.filter(r => r.status === 'pending').length
  const totalEarned    = referrals
    .filter(r => r.is_claimed === 1)
    .reduce((s, r) => s + r.reward, 0)
  const pendingPayout  = referrals
    .filter(r => r.status === 'pending')
    .reduce((s, r) => s + r.reward, 0)

  return {
    referrals,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refresh: query.refetch,
    total, completed, pending, pendingPayout, totalEarned,
  }
}
