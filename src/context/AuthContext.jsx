import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { login as loginRequest } from '../lib/login'
import { setOnSessionExpired } from '../lib/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const USER_KEY = 'veloxzap.user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = sessionStorage.getItem(USER_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    else sessionStorage.removeItem(USER_KEY)
  }, [user])

  useEffect(() => {
    setOnSessionExpired(() => {
      setUser(null)
      setError({ message: 'Your session has expired. Please sign in again.', code: 'SESSION_EXPIRED' })
    })
    return () => setOnSessionExpired(null)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)

    const result = await loginRequest({ email, password })

    setLoading(false)
    if (result.success) {
      setUser(result.user)
    } else {
      setError({ message: result.message, code: result.code })
    }
    return result
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // network errors are non-fatal — clear local state regardless
    }
    setUser(null)
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setError(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      error,
      login,
      logout,
      reset,
    }),
    [user, loading, error, login, logout, reset]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
