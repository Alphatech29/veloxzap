import { useCallback, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchaseBetting, validateBetting } from '../services/betting'
import { queryKeys } from '../lib/queryKeys'

function mutationError(mutation, fallback) {
  return mutation.data && !mutation.data.success
    ? (mutation.data.message || fallback)
    : null
}

export default function useBetting() {
  const queryClient = useQueryClient()

  const [customerName, setCustomerName] = useState(null)
  const [reference, setReference] = useState('')

  const validateMutation = useMutation({
    mutationFn: ({ serviceID, betting_number }) => validateBetting({ serviceID, betting_number }),
    onMutate: () => {
      setCustomerName(null)
    },
    onSuccess: (result) => {
      if (result.success) setCustomerName(result.data?.customerName || 'Account verified')
    },
  })

  const validate = useCallback((payload) => validateMutation.mutateAsync(payload), [validateMutation])

  const buyMutation = useMutation({
    mutationFn: (payload) => purchaseBetting(payload),
    onSuccess: (result) => {
      if (result.success) {
        setReference(result.data?.reference || '')
        queryClient.invalidateQueries({ queryKey: queryKeys.wallet })
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.recent })
      }
    },
  })

  const buy = useCallback((payload) => buyMutation.mutateAsync(payload), [buyMutation])

  const resetValidation = useCallback(() => {
    validateMutation.reset()
    setCustomerName(null)
  }, [validateMutation])

  const reset = useCallback(() => {
    validateMutation.reset()
    buyMutation.reset()
    setCustomerName(null)
    setReference('')
  }, [validateMutation, buyMutation])

  return {
    buying: buyMutation.isPending,
    buyError: buyMutation.isPending ? null : mutationError(buyMutation, 'Payment failed. Please try again.'),
    reference,
    validating: validateMutation.isPending,
    customerName,
    validationError: validateMutation.isPending ? null : mutationError(validateMutation, 'Account not found'),
    validate, buy, reset, resetValidation,
  }
}
