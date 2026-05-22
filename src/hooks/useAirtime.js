import { useCallback, useEffect, useState } from 'react'
import { purchaseAirtime, getRecentAirtimeNumbers } from '../lib/airtime'

export const PRESETS = [50, 100, 200, 500, 1000, 2000]

export const CASHBACK_RATE = 0.00

export default function useAirtime({ autoRecent = true } = {}) {
  const [recentNumbers, setRecentNumbers] = useState([])
  const [recentLoading, setRecentLoading] = useState(false)

  const [buying,   setBuying]   = useState(false)
  const [buyError, setBuyError] = useState(null)

  const fetchRecent = useCallback(async () => {
    setRecentLoading(true)
    const result = await getRecentAirtimeNumbers()
    setRecentLoading(false)
    if (result.success) setRecentNumbers(result.numbers)
    return result
  }, [])

  useEffect(() => {
    if (autoRecent) fetchRecent()
  }, [autoRecent, fetchRecent])

  const buy = useCallback(async ({ phone, amount, network, pin }) => {
    setBuying(true)
    setBuyError(null)

    const result = await purchaseAirtime({ phone, amount, network, pin })

    setBuying(false)

    if (!result.success) {
      setBuyError(result.message || 'Airtime purchase failed.')
    } else {
      fetchRecent()
    }

    return result
  }, [fetchRecent])

  const reset = useCallback(() => {
    setBuyError(null)
  }, [])

  return {
    recentNumbers,
    recentLoading,

    buying,
    buyError,

    buy,
    refreshRecent: fetchRecent,
    reset,
  }
}
