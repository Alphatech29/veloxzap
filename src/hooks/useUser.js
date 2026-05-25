import { useCallback, useEffect, useState } from 'react'
import {
  getCurrentUser,
  getWallet,
  getDedicatedAccount,
  updateAvatar as updateAvatarRequest,
} from '../lib/user'
import { useAuth } from '../context/AuthContext'
import { subscribePush } from '../lib/push'

export default function useUser({ auto = true } = {}) {
  const { isAuthenticated } = useAuth()

  const [user,             setUser]             = useState(null)
  const [wallet,           setWallet]           = useState(null)
  const [dedicatedAccount, setDedicatedAccount] = useState(null)
  const [loading,          setLoading]          = useState(false)
  const [error,            setError]            = useState(null)

  const [updating,    setUpdating]    = useState(false)
  const [updateError, setUpdateError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [userResult, walletResult, accountResult] = await Promise.all([
      getCurrentUser(),
      getWallet(),
      getDedicatedAccount(),
    ])
    setLoading(false)
    if (userResult.success) setUser(userResult.user)
    else setError({ message: userResult.message, code: userResult.code, status: userResult.status })

    if (walletResult.success) setWallet(walletResult.wallet)
    if (accountResult.success) setDedicatedAccount(accountResult.account)

    return { user: userResult, wallet: walletResult, account: accountResult }
  }, [])

  const refreshWallet = useCallback(async () => {
    const result = await getWallet()
    if (result.success) setWallet(result.wallet)
    return result
  }, [])

  useEffect(() => {
    if (!auto) return
    if (!isAuthenticated) {
      setUser(null)
      setWallet(null)
      setDedicatedAccount(null)
      return
    }
    fetchAll()
    subscribePush()

    const API_BASE = import.meta.env.VITE_API_BASE_URL
    const es = new EventSource(`${API_BASE}/api/v1/users/wallet-stream`, { withCredentials: true })

    es.addEventListener('wallet', e => {
      try {
        const data = JSON.parse(e.data)
        setWallet(prev => prev ? { ...prev, ...data } : data)
      } catch { /* malformed event */ }
    })

    es.onerror = () => {
      // Browser auto-reconnects; nothing to do
    }

    return () => es.close()
  }, [auto, isAuthenticated, fetchAll])

  const updateAvatar = useCallback(async (file) => {
    setUpdating(true)
    setUpdateError(null)
    try {
      const result = await updateAvatarRequest(file)
      if (result.success) {
        setUser(prev => (prev ? { ...prev, avatar: result.avatar } : prev))
      } else {
        setUpdateError({ message: result.message, code: result.code })
      }
      return result
    } finally {
      setUpdating(false)
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setUpdateError(null)
  }, [])

  return {
    user,
    wallet,
    dedicatedAccount,
    loading,
    error,

    updating,
    updateError,

    refresh: fetchAll,
    refreshWallet,
    updateAvatar,
    reset,
  }
}
