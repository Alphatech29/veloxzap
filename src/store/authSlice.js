import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login as loginRequest } from '../services/login'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const USER_KEY = 'veloxzap.user'

function loadUser() {
  try {
    const cached = sessionStorage.getItem(USER_KEY)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  const result = await loginRequest({ email, password })
  if (!result.success) {
    return rejectWithValue({ message: result.message, code: result.code })
  }
  return result.user
})

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // network errors are non-fatal — clear local state regardless
  }
})

const initialUser = loadUser()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    isAuthenticated: Boolean(initialUser),
    loading: false,
    error: null,
  },
  reducers: {
    sessionExpired(state) {
      state.user = null
      state.isAuthenticated = false
      state.error = { message: 'Your session has expired. Please sign in again.', code: 'SESSION_EXPIRED' }
    },
    resetAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || { message: 'Login failed. Please try again.' }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { sessionExpired, resetAuthError } = authSlice.actions
export default authSlice.reducer
