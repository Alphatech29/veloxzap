import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { verifySmileEmail, getInternetVariations, purchaseInternet } from '../lib/internet'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

function mutationError(mutation, fallback) {
  return mutation.data && !mutation.data.success
    ? (mutation.data.message || fallback)
    : null
}

export default function useInternet() {
  const queryClient = useQueryClient()

  const [verifyStatus, setVerifyStatus] = useState('idle') // idle | loading | found | invalid
  const [customerName, setCustomerName] = useState('')
  const [smileAccounts, setSmileAccounts] = useState([])

  const [serviceID, setServiceID] = useState(null)

  const [reference, setReference] = useState('')
  const [scratchcard, setScratchcard] = useState(null) // { pin, serialNumber, expiresOn }

  const timerRef = useRef(null)

  const verifyMutation = useMutation({
    mutationFn: (email) => verifySmileEmail(email),
    onSuccess: (result) => {
      if (result.success) {
        setCustomerName(result.data?.customerName || '')
        setSmileAccounts(result.data?.accounts || [])
        setVerifyStatus('found')
      } else {
        setCustomerName('')
        setSmileAccounts([])
        setVerifyStatus('invalid')
      }
    },
  })

  const verifyEmail = useCallback((email) => {
    clearTimeout(timerRef.current)
    if (!email || !email.includes('@')) {
      setVerifyStatus('idle')
      setCustomerName('')
      setSmileAccounts([])
      return
    }
    setVerifyStatus('loading')
    timerRef.current = setTimeout(() => {
      verifyMutation.mutate(email)
    }, 700)
  }, [verifyMutation])

  const variationsQuery = useQuery({
    queryKey: queryKeys.internet.variations(serviceID),
    queryFn: () => unwrap(getInternetVariations(serviceID)),
    select: (data) => data.data || [],
    enabled: !!serviceID,
    staleTime: 30 * 60_000,
  })

  const loadVariations = useCallback((sid) => {
    setServiceID(sid || null)
  }, [])

  const buyMutation = useMutation({
    mutationFn: (payload) => purchaseInternet(payload),
    onSuccess: (result) => {
      if (result.success) {
        setReference(result.data?.reference || '')
        setScratchcard(result.data?.pin || null)
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
    setSmileAccounts([])
  }, [verifyMutation])

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    verifyMutation.reset()
    buyMutation.reset()
    setVerifyStatus('idle')
    setCustomerName('')
    setSmileAccounts([])
    setServiceID(null)
    setReference('')
    setScratchcard(null)
  }, [verifyMutation, buyMutation])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return {
    verifyStatus, customerName, smileAccounts,
    verifyEmail, resetVerify,
    variationsLoading: !!serviceID && variationsQuery.isLoading,
    variations: variationsQuery.data ?? [],
    loadVariations,
    buying: buyMutation.isPending,
    buyError: mutationError(buyMutation, 'Payment failed. Please try again.'),
    reference, scratchcard,
    buy, reset,
  }
}
