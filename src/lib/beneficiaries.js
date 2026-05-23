import { apiFetch } from './api'

export async function fetchBeneficiaries() {
  const result = await apiFetch('/api/v1/users/beneficiaries', { method: 'GET' })
  if (!result.success) return { success: false, beneficiaries: [], message: result.message }
  return { success: true, beneficiaries: result.data ?? [] }
}

export async function saveBeneficiary({ account_name, account_number, bank_name, bank_code }) {
  const result = await apiFetch('/api/v1/users/beneficiaries', {
    method: 'POST',
    body: { account_name, account_number, bank_name, bank_code },
  })
  return { success: result.success, message: result.message }
}
