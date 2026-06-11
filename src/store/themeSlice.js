import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'veloxzap.theme'

function loadTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'dark'
  } catch {
    return 'dark'
  }
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    value: loadTheme(),
  },
  reducers: {
    toggleTheme(state) {
      state.value = state.value === 'dark' ? 'light' : 'dark'
    },
    setTheme(state, action) {
      state.value = action.payload
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
