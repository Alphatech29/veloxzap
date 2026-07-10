import { apiFetch } from '../lib/api'

export async function fetchRewardRules() {
  const result = await apiFetch('/api/v1/users/reward-rules', { method: 'GET' })

  if (result.status === 404) return { success: true, rows: [] }

  if (!result.success) return { success: false, message: result.message, rows: [] }

  const rows = Array.isArray(result.data) ? result.data : []

  return { success: true, rows }
}

export async function claimRewardTransaction(id) {
  return apiFetch(`/api/v1/users/reward-transactions/${id}/claim`, { method: 'POST' })
}

export async function fetchRewardTransactions() {
  const result = await apiFetch('/api/v1/users/reward-transactions', { method: 'GET' })

  if (result.status === 404) return { success: true, rows: [] }

  if (!result.success) return { success: false, message: result.message, rows: [] }

  const rows = Array.isArray(result.data) ? result.data : []

  return { success: true, rows }
}
