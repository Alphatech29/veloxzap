import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

/**
 * Awaits an apiFetch-based call and throws when `success` is falsy, so
 * lib/*.js functions can be used directly as queryFn/mutationFn while
 * still giving TanStack Query proper error states.
 */
export async function unwrap(promise) {
  const result = await promise
  if (!result.success) {
    const error = new Error(result.message || 'Request failed')
    error.code = result.code
    error.status = result.status
    throw error
  }
  return result
}
