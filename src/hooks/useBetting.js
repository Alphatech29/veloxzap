import { useCallback, useState } from 'react'
import { purchaseBetting, validateBetting } from '../lib/betting'

export default function useBetting() {
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState(null)
  const [reference, setReference] = useState('')
  const [validating, setValidating] = useState(false)
  const [customerName, setCustomerName] = useState(null)
  const [validationError, setValidationError] = useState(null)

  const validate = useCallback(async ({ serviceID, betting_number }) => {
    setValidating(true)
    setCustomerName(null)
    setValidationError(null)
    const result = await validateBetting({ serviceID, betting_number })
    setValidating(false)
    if (result.success) {
      setCustomerName(result.data?.customerName || 'Account verified')
    } else {
      setValidationError(result.message || 'Account not found')
    }
    return result
  }, [])

  const buy = useCallback(async ({ serviceID, billersCode, amount, pin }) => {
    setBuying(true)
    setBuyError(null)
    const result = await purchaseBetting({ serviceID, billersCode, amount, pin })
    setBuying(false)
    if (!result.success) {
      const msg = result.message || 'Payment failed. Please try again.'
      setBuyError(msg)
      return { success: false, message: msg }
    }
    setReference(result.data?.reference || '')
    return result
  }, [])

  const resetValidation = useCallback(() => {
    setValidating(false)
    setCustomerName(null)
    setValidationError(null)
  }, [])

  const reset = useCallback(() => {
    setBuying(false)
    setBuyError(null)
    setReference('')
    setValidating(false)
    setCustomerName(null)
    setValidationError(null)
  }, [])

  return {
    buying, buyError, reference,
    validating, customerName, validationError,
    validate, buy, reset, resetValidation,
  }
}
