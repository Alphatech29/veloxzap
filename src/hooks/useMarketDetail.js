import { useQuery } from '@tanstack/react-query'
import { getMarketOverview, getMarketChart } from '../services/market'
import { queryKeys } from '../lib/queryKeys'

export default function useMarketDetail(symbol, days) {
  const overviewQuery = useQuery({
    queryKey: queryKeys.market.overview(symbol),
    queryFn: () => getMarketOverview(symbol),
    enabled: !!symbol,
    refetchInterval: 60_000,
    retry: 1,
  })

  const chartQuery = useQuery({
    queryKey: queryKeys.market.chart(symbol, days),
    queryFn: () => getMarketChart(symbol, days),
    enabled: !!symbol,
    staleTime: 30_000,
    retry: 1,
  })

  return {
    overview: overviewQuery.data ?? null,
    overviewLoading: overviewQuery.isLoading,
    chart: chartQuery.data ?? [],
    chartLoading: chartQuery.isLoading,
  }
}
