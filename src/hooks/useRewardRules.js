import { useQuery } from '@tanstack/react-query'
import { fetchRewardRules } from '../services/rewardRules'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

function normalize(row) {
  return {
    id:         row.id,
    sourceType: row.source_type ?? null,
    points:     Number(row.points_per_unit ?? row.points ?? 0),
    multiplier: Number(row.multiplier ?? 1),
    label:      row.label ?? row.source_type ?? null,
    isActive:   Number(row.is_active ?? 1) === 1,
    createdAt:  row.created_at ?? null,
  }
}

export default function useRewardRules({ autoFetch = true } = {}) {
  const query = useQuery({
    queryKey: queryKeys.rewards.rules,
    queryFn: () => unwrap(fetchRewardRules()),
    select: (data) => data.rows.map(normalize),
    enabled: autoFetch,
  })

  const rules = query.data ?? []

  function getRuleFor(sourceType) {
    return rules.find(r => r.sourceType === sourceType) ?? null
  }

  return {
    rules,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refresh: query.refetch,
    getRuleFor,
  }
}
