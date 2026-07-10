import { useQuery } from '@tanstack/react-query'
import { getPublicBlogPosts } from '../services/blog'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

export default function usePublicBlogPosts() {
  const query = useQuery({
    queryKey: queryKeys.blog.posts,
    queryFn: () => unwrap(getPublicBlogPosts()),
    select: (data) => data.posts,
    staleTime: 5 * 60_000,
  })

  return {
    posts: query.data ?? [],
    loading: query.isLoading,
  }
}
