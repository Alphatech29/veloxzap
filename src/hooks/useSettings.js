import { useQuery } from '@tanstack/react-query'
import { getWebSettings } from '../lib/settings'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

export default function useSettings() {
  const query = useQuery({
    queryKey: queryKeys.settings.web,
    queryFn: () => unwrap(getWebSettings()),
    select: (data) => data.settings,
    staleTime: Infinity,
  })

  return {
    settings: query.data ?? null,
    loading: query.isLoading,
    error: query.error?.message ?? null,
  }
}
