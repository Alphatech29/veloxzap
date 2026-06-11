import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBeneficiaries } from '../lib/beneficiaries'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

export default function useBeneficiaries() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.beneficiaries,
    queryFn: () => unwrap(fetchBeneficiaries()),
    select: (data) => data.beneficiaries,
  })

  // Optimistically prepend / update a beneficiary after a successful transfer
  const addOrUpdate = useCallback(({ account_name, account_number, bank_name, bank_code }) => {
    queryClient.setQueryData(queryKeys.beneficiaries, (prev) => {
      const list = prev?.beneficiaries ?? []
      const exists = list.findIndex(b => b.account_number === account_number && b.bank_code === bank_code)
      const entry = { account_name, account_number, bank_name, bank_code, last_used_at: new Date().toISOString() }
      const updated = exists !== -1
        ? [entry, ...list.slice(0, exists), ...list.slice(exists + 1)]
        : [entry, ...list].slice(0, 20)
      return { ...(prev ?? { success: true }), beneficiaries: updated }
    })
  }, [queryClient])

  return {
    beneficiaries: query.data ?? [],
    loading: query.isLoading,
    reload: query.refetch,
    addOrUpdate,
  }
}
