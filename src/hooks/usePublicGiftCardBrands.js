import { useQuery } from '@tanstack/react-query'
import { getPublicGiftCardBrands } from '../services/giftcards'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

export default function usePublicGiftCardBrands() {
  const query = useQuery({
    queryKey: queryKeys.giftcards.publicBrands,
    queryFn: () => unwrap(getPublicGiftCardBrands()),
    select: (data) => data.brands,
    staleTime: 5 * 60_000,
  })

  return {
    brands: query.data ?? [],
    loading: query.isLoading,
  }
}
