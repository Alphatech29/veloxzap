import { useCallback, useEffect, useRef, useState } from 'react'
import { verifyMeter, purchaseElectricity } from '../lib/bills'

export default function useBills() {
  // ── Meter verification ──
  const [verifyStatus, setVerifyStatus] = useState('idle')
  const [customerName, setCustomerName] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [minimumAmount, setMinimumAmount] = useState(null)

  // ── Purchase ──
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState(null)
  const [token, setToken] = useState('')
  const [reference, setReference] = useState('')

  const timerRef = useRef(null)

  const verify = useCallback(({ billersCode, serviceID, type }) => {
    clearTimeout(timerRef.current)

    if (!billersCode || billersCode.length < 6 || !serviceID) {
      setVerifyStatus('idle')
      setCustomerName('')
      setCustomerAddress('')
      setMinimumAmount(null)
      return
    }

    setVerifyStatus('loading')
    timerRef.current = setTimeout(async () => {
      const result = await verifyMeter({ billersCode, serviceID, type })
      if (result.success) {
        setCustomerName(result.data?.customerName || '')
        setCustomerAddress(result.data?.customerAddress || '')
        setMinimumAmount(result.data?.minimumAmount ?? null)
        setVerifyStatus('found')
      } else {
        setCustomerName('')
        setCustomerAddress('')
        setMinimumAmount(null)
        setVerifyStatus('invalid')
      }
    }, 700)
  }, [])

  const buy = useCallback(async ({ billersCode, serviceID, variation_code, amount, pin, phone = '' }) => {
    setBuying(true)
    setBuyError(null)

    try {
      const result = await purchaseElectricity({ billersCode, serviceID, variation_code, amount, pin, phone })
      setBuying(false)
      if (!result.success) {
        setBuyError(result.message || 'Payment failed. Please try again.')
      } else {
        setToken(result.data?.token || '')
        setReference(result.data?.reference || '')
      }
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
    setCustomerAddress('')
    setMinimumAmount(null)
  }, [])

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    setVerifyStatus('idle')
    setCustomerName('')
    setCustomerAddress('')
    setMinimumAmount(null)
    setBuying(false)
    setBuyError(null)
    setToken('')
    setReference('')
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return {
    verifyStatus,
    customerName,
    customerAddress,
    minimumAmount,
    verify,
    resetVerify,

    buying,
    buyError,
    token,
    reference,
    buy,
    reset,
  }
}
