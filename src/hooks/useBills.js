import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { verifyMeter, purchaseElectricity } from '../lib/bills'
import { queryKeys } from '../lib/queryKeys'

function mutationError(mutation, fallback) {
  return mutation.data && !mutation.data.success
    ? (mutation.data.message || fallback)
    : null
}

export default function useBills() {
  const queryClient = useQueryClient()

  // ── Meter verification ──
  const [verifyStatus, setVerifyStatus] = useState('idle')
  const [customerName, setCustomerName] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [minimumAmount, setMinimumAmount] = useState(null)

  // ── Purchase ──
  const [token, setToken] = useState('')
  const [reference, setReference] = useState('')

  const timerRef = useRef(null)

  const verifyMutation = useMutation({
    mutationFn: ({ billersCode, serviceID, type }) => verifyMeter({ billersCode, serviceID, type }),
    onSuccess: (result) => {
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
    },
  })

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
    timerRef.current = setTimeout(() => {
      verifyMutation.mutate({ billersCode, serviceID, type })
    }, 700)
  }, [verifyMutation])

  const buyMutation = useMutation({
    mutationFn: (payload) => purchaseElectricity(payload),
    onSuccess: (result) => {
      if (result.success) {
        setToken(result.data?.token || '')
        setReference(result.data?.reference || '')
        queryClient.invalidateQueries({ queryKey: queryKeys.wallet })
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.recent })
      }
    },
  })

  const buy = useCallback((payload) => buyMutation.mutateAsync(payload), [buyMutation])

  const resetVerify = useCallback(() => {
    clearTimeout(timerRef.current)
    verifyMutation.reset()
    setVerifyStatus('idle')
    setCustomerName('')
    setCustomerAddress('')
    setMinimumAmount(null)
  }, [verifyMutation])

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    verifyMutation.reset()
    buyMutation.reset()
    setVerifyStatus('idle')
    setCustomerName('')
    setCustomerAddress('')
    setMinimumAmount(null)
    setToken('')
    setReference('')
  }, [verifyMutation, buyMutation])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return {
    verifyStatus,
    customerName,
    customerAddress,
    minimumAmount,
    verify,
    resetVerify,

    buying: buyMutation.isPending,
    buyError: mutationError(buyMutation, 'Payment failed. Please try again.'),
    token,
    reference,
    buy,
    reset,
  }
}
