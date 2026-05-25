import { useCallback, useEffect, useRef, useState } from 'react'
import { verifySmartcard, getTvVariations, changeBouquet, renewBouquet } from '../lib/cable'

export default function useCable() {
  // Smartcard verify
  const [verifyStatus, setVerifyStatus] = useState('idle')
  const [customerName, setCustomerName] = useState('')
  const [currentBouquet, setCurrentBouquet] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [renewalAmount, setRenewalAmount] = useState(null)

  // Variations
  const [variationsLoading, setVariationsLoading] = useState(false)
  const [variations, setVariations] = useState([])

  // Purchase
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState(null)
  const [reference, setReference] = useState('')

  const timerRef = useRef(null)

  const verify = useCallback(({ billersCode, serviceID }) => {
    clearTimeout(timerRef.current)

    if (!billersCode || billersCode.length < 6 || !serviceID) {
      setVerifyStatus('idle')
      setCustomerName('')
      setCurrentBouquet('')
      setDueDate('')
      setRenewalAmount(null)
      return
    }

    setVerifyStatus('loading')
    timerRef.current = setTimeout(async () => {
      const result = await verifySmartcard({ billersCode, serviceID })
      if (result.success) {
        setCustomerName(result.data?.customerName || '')
        setCurrentBouquet(result.data?.currentBouquet || '')
        setDueDate(result.data?.dueDate || '')
        setRenewalAmount(result.data?.renewalAmount ?? null)
        setVerifyStatus('found')
      } else {
        setCustomerName('')
        setCurrentBouquet('')
        setDueDate('')
        setRenewalAmount(null)
        setVerifyStatus('invalid')
      }
    }, 700)
  }, [])

  const loadVariations = useCallback(async (serviceID) => {
    if (!serviceID) { setVariations([]); return }
    setVariationsLoading(true)
    const result = await getTvVariations(serviceID)
    setVariationsLoading(false)
    if (result.success) {
      setVariations(result.data || [])
    } else {
      setVariations([])
    }
  }, [])

  const buy = useCallback(async ({ billersCode, serviceID, variation_code, amount, phone, pin, action }) => {
    setBuying(true)
    setBuyError(null)

    try {
      const fn = action === 'renew' ? renewBouquet : changeBouquet
      const result = await fn({ billersCode, serviceID, variation_code, amount, phone, pin })

      setBuying(false)

      if (!result?.success) {
        const msg = result?.message || 'Payment failed. Please try again.'
        setBuyError(msg)
        return { success: false, message: msg }
      }

      setReference(result.data?.reference || '')
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
    setCurrentBouquet('')
    setDueDate('')
    setRenewalAmount(null)
  }, [])

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    setVerifyStatus('idle')
    setCustomerName('')
    setCurrentBouquet('')
    setDueDate('')
    setRenewalAmount(null)
    setVariations([])
    setBuying(false)
    setBuyError(null)
    setReference('')
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return {
    verifyStatus,
    customerName,
    currentBouquet,
    dueDate,
    renewalAmount,
    verify,
    resetVerify,

    variationsLoading,
    variations,
    loadVariations,

    buying,
    buyError,
    reference,
    buy,
    reset,
  }
}
