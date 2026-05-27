import { useCallback, useEffect, useState } from 'react'
import { fetchReferrals } from '../lib/referrals'

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
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await fetchReferrals()
    setLoading(false)
    if (result.success) {
      setReferrals(result.rows.map(normalize))
    } else {
      setError(result.message || 'Failed to load referrals.')
    }
    return result
  }, [])

  useEffect(() => {
    if (autoFetch) fetch()
  }, [autoFetch, fetch])

  const refresh = useCallback(() => fetch(), [fetch])

  const total          = referrals.length
  const completed      = referrals.filter(r => r.status === 'paid').length
  const pending        = referrals.filter(r => r.status === 'pending').length
  const totalEarned    = referrals
    .filter(r => r.is_claimed === 1)
    .reduce((s, r) => s + r.reward, 0)
  const pendingPayout  = referrals
    .filter(r => r.status === 'pending')
    .reduce((s, r) => s + r.reward, 0)

  return { referrals, loading, error, refresh, total, completed, pending, pendingPayout, totalEarned }
}
