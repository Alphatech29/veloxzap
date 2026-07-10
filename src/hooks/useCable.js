import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { verifySmartcard, getTvVariations, changeBouquet, renewBouquet } from '../services/cable'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

function mutationError(mutation, fallback) {
  return mutation.data && !mutation.data.success
    ? (mutation.data.message || fallback)
    : null
}

export default function useCable() {
  const queryClient = useQueryClient()

  // Smartcard verify
  const [verifyStatus, setVerifyStatus] = useState('idle')
  const [customerName, setCustomerName] = useState('')
  const [currentBouquet, setCurrentBouquet] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [renewalAmount, setRenewalAmount] = useState(null)

  // Variations
  const [serviceID, setServiceID] = useState(null)

  // Purchase
  const [reference, setReference] = useState('')

  const timerRef = useRef(null)

  const verifyMutation = useMutation({
    mutationFn: ({ billersCode, serviceID }) => verifySmartcard({ billersCode, serviceID }),
    onSuccess: (result) => {
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
    },
  })

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
    timerRef.current = setTimeout(() => {
      verifyMutation.mutate({ billersCode, serviceID })
    }, 700)
  }, [verifyMutation])

  const variationsQuery = useQuery({
    queryKey: queryKeys.cable.variations(serviceID),
    queryFn: () => unwrap(getTvVariations(serviceID)),
    select: (data) => data.data || [],
    enabled: !!serviceID,
    staleTime: 30 * 60_000,
  })

  const loadVariations = useCallback((sid) => {
    setServiceID(sid || null)
  }, [])

  const buyMutation = useMutation({
    mutationFn: ({ action, ...payload }) => (action === 'renew' ? renewBouquet(payload) : changeBouquet(payload)),
    onSuccess: (result) => {
      if (result.success) {
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
    setCurrentBouquet('')
    setDueDate('')
    setRenewalAmount(null)
  }, [verifyMutation])

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    verifyMutation.reset()
    buyMutation.reset()
    setVerifyStatus('idle')
    setCustomerName('')
    setCurrentBouquet('')
    setDueDate('')
    setRenewalAmount(null)
    setServiceID(null)
    setReference('')
  }, [verifyMutation, buyMutation])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return {
    verifyStatus,
    customerName,
    currentBouquet,
    dueDate,
    renewalAmount,
    verify,
    resetVerify,

    variationsLoading: !!serviceID && variationsQuery.isLoading,
    variations: variationsQuery.data ?? [],
    loadVariations,

    buying: buyMutation.isPending,
    buyError: mutationError(buyMutation, 'Payment failed. Please try again.'),
    reference,
    buy,
    reset,
  }
}
