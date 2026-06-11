import { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getBanks, verifyBankAccount, submitWithdrawal } from '../lib/withdraw'
import { buildCodeMap } from '../utils/bankLogos'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

export const MIN_TRANSFER = 100

// CBN/NIP fee tiers for interbank transfers
export function getTransferFee(amount) {
  const n = Number(amount) || 0
  if (n <= 5_000)  return 10
  if (n <= 50_000) return 25
  return 50
}

const PINNED = ['opay', 'zenith', 'guaranty trust', 'gtbank', 'palmpay', 'kuda', 'first bank', 'moniepoint']

function sortBanks(banks) {
  const pinIndex = name => {
    const n = name.toLowerCase()
    const i = PINNED.findIndex(p => n.includes(p))
    return i === -1 ? Infinity : i
  }
  return [...banks].sort((a, b) => {
    const pa = pinIndex(a.name), pb = pinIndex(b.name)
    if (pa !== pb) return pa - pb
    return a.name.localeCompare(b.name)
  })
}

function mutationError(mutation, fallback) {
  return mutation.data && !mutation.data.success
    ? (mutation.data.message || fallback)
    : null
}

export default function useWithdraw() {
  const queryClient = useQueryClient()

  const banksQuery = useQuery({
    queryKey: queryKeys.withdraw.banks,
    queryFn: () => unwrap(getBanks()),
    select: (data) => sortBanks(data.banks),
    staleTime: 10 * 60_000,
  })

  useEffect(() => {
    if (banksQuery.data) buildCodeMap(banksQuery.data)
  }, [banksQuery.data])

  const [accountName, setAccountName] = useState('')

  const verifyMutation = useMutation({
    mutationFn: (payload) => verifyBankAccount(payload),
    onSuccess: (result) => {
      if (result.success) setAccountName(result.account_name)
    },
  })

  const verify = useCallback(async (payload) => {
    setAccountName('')
    return verifyMutation.mutateAsync(payload)
  }, [verifyMutation])

  const submitMutation = useMutation({
    mutationFn: (payload) => submitWithdrawal(payload),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.wallet })
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.recent })
      }
    },
  })

  const submit = useCallback((payload) => submitMutation.mutateAsync(payload), [submitMutation])

  const reset = useCallback(() => {
    verifyMutation.reset()
    submitMutation.reset()
  }, [verifyMutation, submitMutation])

  const clearRecipient = useCallback(() => {
    verifyMutation.reset()
    setAccountName('')
  }, [verifyMutation])

  return {
    banks: banksQuery.data ?? [],
    banksLoading: banksQuery.isLoading,
    verifying: verifyMutation.isPending,
    verifyError: mutationError(verifyMutation, 'Verification failed.'),
    accountName, setAccountName,
    verify,
    submitting: submitMutation.isPending,
    submitError: mutationError(submitMutation, 'Withdrawal failed.'),
    submit,
    reset,
    clearRecipient,
  }
}
