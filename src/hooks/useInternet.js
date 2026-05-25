import { useCallback, useEffect, useRef, useState } from 'react'
import { verifySmileEmail, getInternetVariations, purchaseInternet } from '../lib/internet'

export default function useInternet() {
  const [verifyStatus, setVerifyStatus] = useState('idle') // idle | loading | found | invalid
  const [customerName, setCustomerName] = useState('')
  const [smileAccounts, setSmileAccounts] = useState([])

  const [variationsLoading, setVariationsLoading] = useState(false)
  const [variations, setVariations] = useState([])

  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState(null)
  const [reference, setReference] = useState('')
  const [scratchcard, setScratchcard] = useState(null) // { pin, serialNumber, expiresOn }

  const timerRef = useRef(null)

  const verifyEmail = useCallback((email) => {
    clearTimeout(timerRef.current)
    if (!email || !email.includes('@')) {
      setVerifyStatus('idle')
      setCustomerName('')
      setSmileAccounts([])
      return
    }
    setVerifyStatus('loading')
    timerRef.current = setTimeout(async () => {
      const result = await verifySmileEmail(email)
      if (result.success) {
        setCustomerName(result.data?.customerName || '')
        setSmileAccounts(result.data?.accounts || [])
        setVerifyStatus('found')
      } else {
        setCustomerName('')
        setSmileAccounts([])
        setVerifyStatus('invalid')
      }
    }, 700)
  }, [])

  const loadVariations = useCallback(async (serviceID) => {
    if (!serviceID) { setVariations([]); return }
    setVariationsLoading(true)
    const result = await getInternetVariations(serviceID)
    setVariationsLoading(false)
    setVariations(result.success ? (result.data || []) : [])
  }, [])

  const buy = useCallback(async ({ serviceID, billersCode, variation_code, amount, phone, pin }) => {
    setBuying(true)
    setBuyError(null)
    try {
      const result = await purchaseInternet({ serviceID, billersCode, variation_code, amount, phone, pin })
      setBuying(false)
      if (!result.success) {
        const msg = result.message || 'Payment failed. Please try again.'
        setBuyError(msg)
        return { success: false, message: msg }
      }
      setReference(result.data?.reference || '')
      setScratchcard(result.data?.pin || null)
      return result
    } catch {
      setBuying(false)
      const msg = 'Network error. Please try again.'
      setBuyError(msg)
      return { success: false, message: msg }
    }
  }, [])

  const resetVerify = useCallback(() => {
    clearTimeout(timerRef.current)
    setVerifyStatus('idle')
    setCustomerName('')
    setSmileAccounts([])
  }, [])

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    setVerifyStatus('idle')
    setCustomerName('')
    setSmileAccounts([])
    setVariations([])
    setBuying(false)
    setBuyError(null)
    setReference('')
    setScratchcard(null)
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return {
    verifyStatus, customerName, smileAccounts,
    verifyEmail, resetVerify,
    variationsLoading, variations, loadVariations,
    buying, buyError, reference, scratchcard,
    buy, reset,
  }
}
