import { configureStore } from '@reduxjs/toolkit'
import authReducer, { sessionExpired } from './authSlice'
import themeReducer from './themeSlice'
import { setOnSessionExpired } from '../lib/api'
import { queryClient } from '../lib/queryClient'

const USER_KEY = 'veloxzap.user'
const THEME_KEY = 'veloxzap.theme'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
  },
})

setOnSessionExpired(() => store.dispatch(sessionExpired()))

let prevUser = store.getState().auth.user
store.subscribe(() => {
  const { user } = store.getState().auth
  if (user === prevUser) return

  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  } else {
    sessionStorage.removeItem(USER_KEY)
    queryClient.clear()
  }
  prevUser = user
})

let prevTheme = store.getState().theme.value
store.subscribe(() => {
  const { value } = store.getState().theme
  if (value === prevTheme) return
  localStorage.setItem(THEME_KEY, value)
  prevTheme = value
})

export default store
