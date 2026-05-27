import { useEffect, useState } from 'react'
import { getWebSettings } from '../lib/settings'

let _cache = null

// Kick off the fetch immediately on module load — before any component mounts
const _promise = getWebSettings().then(result => {
  if (result.success) _cache = result.settings
  return result
})

export default function useSettings() {
  const [settings, setSettings] = useState(_cache)
  const [loading, setLoading]   = useState(!_cache)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (_cache) {
      setSettings(_cache)
      setLoading(false)
      return
    }

    let cancelled = false
    _promise.then(result => {
      if (cancelled) return
      if (result.success) setSettings(_cache)
      else setError(result.message || 'Could not load settings.')
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  return { settings, loading, error }
}
