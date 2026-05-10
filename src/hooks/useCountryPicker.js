import { useEffect, useMemo, useRef, useState } from 'react'
import COUNTRIES from '../utils/countries.json'

export function flagUrl(code, size = 40) {
  return `https://flagcdn.com/w${size}/${code.toLowerCase()}.png`
}

export function flagSrcSet(code, size = 40) {
  return `${flagUrl(code, size * 2)} 2x`
}

export default function useCountryPicker({ defaultCode = 'NG' } = {}) {
  const initial = useMemo(
    () => COUNTRIES.find(c => c.code === defaultCode) ?? COUNTRIES[0],
    [defaultCode]
  )

  const [country, setCountry]       = useState(initial)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [query, setQuery]           = useState('')
  const pickerRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRIES
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.dial.includes(q)
    )
  }, [query])

  useEffect(() => {
    if (!pickerOpen) return
    function onClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false)
    }
    function onKey(e) { if (e.key === 'Escape') setPickerOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [pickerOpen])

  function togglePicker() {
    setPickerOpen(o => !o)
    setQuery('')
  }

  function closePicker() {
    setPickerOpen(false)
    setQuery('')
  }

  function selectCountry(c) {
    setCountry(c)
    closePicker()
  }

  return {
    countries: COUNTRIES,
    filtered,
    country,
    setCountry,
    selectCountry,
    pickerOpen,
    setPickerOpen,
    togglePicker,
    closePicker,
    query,
    setQuery,
    pickerRef,
    flagUrl,
    flagSrcSet,
  }
}
