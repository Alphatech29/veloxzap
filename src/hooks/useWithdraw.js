import { useCallback, useEffect, useState } from 'react'
import { getBanks, verifyBankAccount, submitWithdrawal } from '../lib/withdraw'

export const MIN_TRANSFER = 100

// CBN/NIP fee tiers for interbank transfers
export function getTransferFee(amount) {
  const n = Number(amount) || 0
  if (n <= 5_000)  return 10
  if (n <= 50_000) return 25
  return 50
}

export default function useWithdraw() {
  const [banks, setBanks]               = useState([])
  const [banksLoading, setBanksLoading] = useState(true)

  useEffect(() => {
    getBanks().then(r => {
      setBanksLoading(false)
      if (r.success) setBanks(r.banks)
    })
  }, [])

  const [verifying, setVerifying]     = useState(false)
  const [verifyError, setVerifyError] = useState(null)
  const [accountName, setAccountName] = useState('')

  const verify = useCallback(async ({ bank_code, account_number }) => {
    setVerifying(true)
    setVerifyError(null)
    setAccountName('')
    const result = await verifyBankAccount({ bank_code, account_number })
    setVerifying(false)
    if (result.success) setAccountName(result.account_name)
    else setVerifyError(result.message)
    return result
  }, [])

  const [submitting, setSubmitting]   = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const submit = useCallback(async (payload) => {
    setSubmitting(true)
    setSubmitError(null)
    const result = await submitWithdrawal(payload)
    setSubmitting(false)
    if (!result.success) setSubmitError(result.message)
    return result
  }, [])

  const reset = useCallback(() => {
    setVerifyError(null)
    setSubmitError(null)
  }, [])

  const clearRecipient = useCallback(() => {
    setVerifyError(null)
    setAccountName('')
  }, [])

  return {
    banks, banksLoading,
    verifying, verifyError, accountName, setAccountName,
    verify,
    submitting, submitError,
    submit,
    reset,
    clearRecipient,
  }
}
