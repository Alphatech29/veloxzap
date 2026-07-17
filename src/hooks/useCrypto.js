import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCryptoBalances, getCryptoAddresses, getCryptoConfig } from '../services/crypto'
import { useAuth } from './useAuth'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

export default function useCrypto({ auto = true } = {}) {
  const { isAuthenticated } = useAuth()

  const balancesQuery = useQuery({
    queryKey: queryKeys.crypto.balances,
    queryFn: () => unwrap(getCryptoBalances()),
    select: (data) => data.balances,
    enabled: auto && isAuthenticated,
  })

  const addressesQuery = useQuery({
    queryKey: queryKeys.crypto.addresses,
    queryFn: () => unwrap(getCryptoAddresses()),
    select: (data) => data.addresses,
    enabled: auto && isAuthenticated,
  })

  const configQuery = useQuery({
    queryKey: queryKeys.crypto.config,
    queryFn: () => unwrap(getCryptoConfig()),
    select: (data) => data.config,
    enabled: auto && isAuthenticated,
    staleTime: 30 * 60_000,
  })

  const refresh = useCallback(async () => {
    const result = await balancesQuery.refetch()
    return result.data
  }, [balancesQuery])

  return {
    balances: balancesQuery.data ?? {},
    addresses: addressesQuery.data ?? [],
    config: configQuery.data ?? null,
    loading: balancesQuery.isLoading,
    addressesLoading: addressesQuery.isLoading,
    configLoading: configQuery.isLoading,
    error: balancesQuery.error,
    refresh,
  }
}
