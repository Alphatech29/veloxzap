import { useCallback, useEffect, useState } from 'react'
import { getGiftCardBrands, submitGiftCardTrade, getRecentGiftCardTrades } from '../lib/giftcards'

export const DENOMINATIONS = [5, 10, 15, 25, 50, 100, 200, 500]

export function countryLabel(id) {
  if (!id) return '—'
  return id.length <= 3
    ? id.toUpperCase()
    : id.charAt(0).toUpperCase() + id.slice(1)
}

export function countryCode(id) {
  if (!id) return ''
  return id.slice(0, 2).toUpperCase()
}


export default function useGiftCards({ autoRecent = true } = {}) {
  const [brands, setBrands]               = useState([])
  const [brandsLoading, setBrandsLoading] = useState(true)

  useEffect(() => {
    getGiftCardBrands().then(r => {
      setBrandsLoading(false)
      if (r.success) setBrands(r.brands)
    })
  }, [])

  const [recentTrades, setRecentTrades]   = useState([])
  const [recentLoading, setRecentLoading] = useState(false)

  const [submitting, setSubmitting]   = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const fetchRecent = useCallback(async () => {
    setRecentLoading(true)
    const result = await getRecentGiftCardTrades()
    setRecentLoading(false)
    if (result.success) setRecentTrades(result.trades)
    return result
  }, [])

  useEffect(() => {
    if (autoRecent) fetchRecent()
  }, [autoRecent, fetchRecent])

  const submit = useCallback(async ({ brandId, subCategoryId, denomination, cardType, codes, images }) => {
    setSubmitting(true)
    setSubmitError(null)
    const result = await submitGiftCardTrade({ brandId, subCategoryId, denomination, cardType, codes, images })
    setSubmitting(false)
    if (!result.success) {
      setSubmitError(result.message || 'Trade submission failed.')
    } else {
      fetchRecent()
    }
    return result
  }, [fetchRecent])

  const reset = useCallback(() => {
    setSubmitError(null)
  }, [])

  return {
    brands,
    brandsLoading,

    recentTrades,
    recentLoading,

    submitting,
    submitError,

    submit,
    refreshRecent: fetchRecent,
    reset,
  }
}
