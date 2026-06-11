import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme, toggleTheme } from '../store/themeSlice'

export function useTheme() {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.theme.value)

  return {
    theme,
    toggleTheme: useCallback(() => dispatch(toggleTheme()), [dispatch]),
    setTheme: useCallback((value) => dispatch(setTheme(value)), [dispatch]),
  }
}
