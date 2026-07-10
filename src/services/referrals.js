import { apiFetch } from '../lib/api'

export async function fetchReferrals() {
  const result = await apiFetch('/api/v1/users/referral', { method: 'GET' })

  if (result.status === 404) return { success: true, rows: [] }

  if (!result.success) return { success: false, message: result.message, rows: [] }

  const rows = Array.isArray(result.data) ? result.data : []

  return { success: true, rows }
}
