import { useCallback, useEffect, useState } from 'react'
import {
  getCurrentUser,
  getWallet,
  updateCountry as updateCountryRequest,
  updateAvatar as updateAvatarRequest,
} from '../lib/user'
import { useAuth } from '../context/AuthContext'

export default function useUser({ auto = true } = {}) {
  const { isAuthenticated } = useAuth()

  const [user,    setUser]    = useState(null)
  const [wallet,  setWallet]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const [updating,    setUpdating]    = useState(false)
  const [updateError, setUpdateError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [userResult, walletResult] = await Promise.all([
      getCurrentUser(),
      getWallet(),
    ])
    setLoading(false)
    if (userResult.success) setUser(userResult.user)
    else setError({ message: userResult.message, code: userResult.code, status: userResult.status })

    if (walletResult.success) setWallet(walletResult.wallet)

    return { user: userResult, wallet: walletResult }
  }, [])

  useEffect(() => {
    if (!auto) return
    if (!isAuthenticated) {
      setUser(null)
      setWallet(null)
      return
    }
    fetchAll()
  }, [auto, isAuthenticated, fetchAll])

  const updateCountry = useCallback(async (country) => {
    setUpdating(true)
    setUpdateError(null)
    const result = await updateCountryRequest(country)
    setUpdating(false)
    if (result.success) {
      setUser(prev => (prev ? { ...prev, country } : prev))
    } else {
      setUpdateError({ message: result.message, code: result.code })
    }
    return result
  }, [])

  const updateAvatar = useCallback(async (file) => {
    setUpdating(true)
    setUpdateError(null)
    const result = await updateAvatarRequest(file)
    setUpdating(false)
    if (result.success) {
      setUser(prev => (prev ? { ...prev, avatar: result.avatar } : prev))
    } else {
      setUpdateError({ message: result.message, code: result.code })
    }
    return result
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setUpdateError(null)
  }, [])

  return {
    user,
    wallet,
    loading,
    error,

    updating,
    updateError,

    refresh: fetchAll,
    updateCountry,
    updateAvatar,
    reset,
  }
}
