import { apiFetch } from '../lib/api'
import { getClientMetadata } from './metadata'

export async function getBanks() {
  const result = await apiFetch('/api/v1/users/banks', { method: 'GET' })
  if (!result.success) return { success: false, banks: [], message: result.message }
  return { success: true, banks: result.data ?? [] }
}

export async function verifyBankAccount({ bank_code, account_number }) {
  const result = await apiFetch('/api/v1/users/resolve-account', {
    method: 'POST',
    body: { account_number, account_code: bank_code },
  })

  const payload = result.payload
  if (payload?.status === 'success' && payload?.data?.account_name) {
    return { success: true, account_name: payload.data.account_name }
  }

  if (!result.success) return { success: false, message: result.message }
  return { success: true, account_name: result.data?.account_name ?? '' }
}

export async function submitWithdrawal({ amount, bank_code, bank_name, account_number, account_name, pin, narration }) {
  const meta = await getClientMetadata()
  const result = await apiFetch('/api/v1/users/transfer', {
    method: 'POST',
    body: {
      recipient: { account_number, bank_code, bank_name, account_name },
      transaction: { amount, narration: narration || '' },
      authorization: { pin },
      metadata: meta,
    },
  })
  if (!result.success) return { success: false, message: result.message }
  return { success: true, message: result.message, data: result.data }
}
