import { useQuery } from '@tanstack/react-query'
import { getMarketRates } from '../services/market'
import { queryKeys } from '../lib/queryKeys'

export default function useMarketRates() {
  const query = useQuery({
    queryKey: queryKeys.market.rates,
    queryFn: getMarketRates,
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 1,
  })

  return {
    rates: query.data ?? {},
    loading: query.isLoading,
    error: query.error,
  }
}
