import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout, resetAuthError } from '../store/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const doLogin = useCallback(async ({ email, password }) => {
    const action = await dispatch(login({ email, password }))
    if (login.fulfilled.match(action)) {
      return { success: true, user: action.payload }
    }
    return { success: false, ...action.payload }
  }, [dispatch])

  const doLogout = useCallback(async () => {
    await dispatch(logout())
  }, [dispatch])

  const reset = useCallback(() => {
    dispatch(resetAuthError())
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: doLogin,
    logout: doLogout,
    reset,
  }
}
