import { useCallback, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getCurrentUser,
  getWallet,
  getDedicatedAccount,
  updateAvatar as updateAvatarRequest,
} from '../lib/user'
import { useAuth } from './useAuth'
import { subscribePush } from '../lib/push'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

export default function useUser({ auto = true } = {}) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const userQuery = useQuery({
    queryKey: queryKeys.user,
    queryFn: () => unwrap(getCurrentUser()),
    select: (data) => data.user,
    enabled: auto && isAuthenticated,
  })

  const walletQuery = useQuery({
    queryKey: queryKeys.wallet,
    queryFn: () => unwrap(getWallet()),
    select: (data) => data.wallet,
    enabled: auto && isAuthenticated,
  })

  const accountQuery = useQuery({
    queryKey: queryKeys.dedicatedAccount,
    queryFn: () => unwrap(getDedicatedAccount()),
    select: (data) => data.account,
    enabled: auto && isAuthenticated,
  })

  useEffect(() => {
    if (!auto || !isAuthenticated) return

    subscribePush()

    const API_BASE = import.meta.env.VITE_API_BASE_URL
    const es = new EventSource(`${API_BASE}/api/v1/users/wallet-stream`, { withCredentials: true })

    es.addEventListener('wallet', e => {
      try {
        const data = JSON.parse(e.data)
        queryClient.setQueryData(queryKeys.wallet, prev =>
          prev ? { ...prev, wallet: { ...prev.wallet, ...data } } : prev
        )
      } catch { /* malformed event */ }
    })

    es.onerror = () => {
      // Browser auto-reconnects; nothing to do
    }

    return () => es.close()
  }, [auto, isAuthenticated, queryClient])

  const refresh = useCallback(async () => {
    const [user, wallet, account] = await Promise.all([
      userQuery.refetch(),
      walletQuery.refetch(),
      accountQuery.refetch(),
    ])
    return { user: user.data, wallet: wallet.data, account: account.data }
  }, [userQuery, walletQuery, accountQuery])

  const refreshWallet = useCallback(async () => {
    const result = await walletQuery.refetch()
    return result.data
  }, [walletQuery])

  const avatarMutation = useMutation({
    mutationFn: (file) => unwrap(updateAvatarRequest(file)),
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.user, prev =>
        prev ? { ...prev, user: { ...prev.user, avatar: result.avatar } } : prev
      )
    },
  })

  const updateAvatar = useCallback((file) => avatarMutation.mutateAsync(file).catch(err => ({
    success: false,
    message: err.message,
    code: err.code,
  })), [avatarMutation])

  const reset = useCallback(() => {
    avatarMutation.reset()
  }, [avatarMutation])

  return {
    user: userQuery.data ?? null,
    wallet: walletQuery.data ?? null,
    dedicatedAccount: accountQuery.data ?? null,
    loading: userQuery.isLoading || walletQuery.isLoading || accountQuery.isLoading,
    error: userQuery.error,

    updating: avatarMutation.isPending,
    updateError: avatarMutation.error ? { message: avatarMutation.error.message, code: avatarMutation.error.code } : null,

    refresh,
    refreshWallet,
    updateAvatar,
    reset,
  }
}
