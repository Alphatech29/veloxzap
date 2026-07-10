import { apiFetch } from '../lib/api'

export async function getSavingsProducts(type) {
  const qs = type && type !== 'All' ? `?type=${encodeURIComponent(type.toLowerCase())}` : ''
  const result = await apiFetch(`/api/v1/users/savings/products${qs}`, { method: 'GET' })

  if (result.status === 404) return { success: true, products: [] }
  if (!result.success) return { success: false, message: result.message, products: [] }

  const products = Array.isArray(result.data?.products) ? result.data.products : []
  return { success: true, products }
}

export async function openSavingsAccount(payload) {
  return apiFetch('/api/v1/users/savings', { method: 'POST', body: JSON.stringify(payload) })
}

export async function getSavingsPlans() {
  const result = await apiFetch('/api/v1/users/savings', { method: 'GET' })

  if (result.status === 404) return { success: true, accounts: [] }
  if (!result.success) return { success: false, message: result.message, accounts: [] }

  const accounts = Array.isArray(result.data?.accounts) ? result.data.accounts : []
  return { success: true, accounts }
}

export async function getSavingsAccount(id) {
  const result = await apiFetch(`/api/v1/users/savings/${id}`, { method: 'GET' })

  if (!result.success) return { success: false, message: result.message, account: null }
  return { success: true, account: result.data || null }
}

export async function getSavingsLedger(id) {
  const result = await apiFetch(`/api/v1/users/savings/${id}/ledger`, { method: 'GET' })

  if (result.status === 404) return { success: true, entries: [] }
  if (!result.success) return { success: false, message: result.message, entries: [] }

  const entries = Array.isArray(result.data?.ledger) ? result.data.ledger : []
  return { success: true, entries }
}

export async function getUserSavingsLedger(type) {
  const qs = type ? `?type=${encodeURIComponent(type)}` : ''
  const result = await apiFetch(`/api/v1/users/savings/ledger${qs}`, { method: 'GET' })

  if (result.status === 404) return { success: true, entries: [] }
  if (!result.success) return { success: false, message: result.message, entries: [] }

  const entries = Array.isArray(result.data?.ledger) ? result.data.ledger : []
  return { success: true, entries }
}

export async function topUpAccount(id, payload) {
  return apiFetch(`/api/v1/users/savings/${id}/top-up`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function withdrawAccount(id, payload) {
  return apiFetch(`/api/v1/users/savings/${id}/withdraw`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function setScheduleStatus(id, action) {
  return apiFetch(`/api/v1/users/savings/schedules/${id}/${action}`, { method: 'PATCH' })
}

export async function updateSchedule(id, payload) {
  return apiFetch(`/api/v1/users/savings/schedules/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
}

export async function createSchedule(id, payload) {
  return apiFetch(`/api/v1/users/savings/${id}/schedule`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function getSavingsWithdrawals(params = {}) {
  const qs = params.status ? `?status=${encodeURIComponent(params.status)}` : ''
  const result = await apiFetch(`/api/v1/users/savings/withdrawals${qs}`, { method: 'GET' })

  if (result.status === 404) return { success: true, withdrawals: [], total: 0 }
  if (!result.success) return { success: false, message: result.message, withdrawals: [], total: 0 }

  const withdrawals = Array.isArray(result.data?.withdrawals) ? result.data.withdrawals : []
  const total = Number(result.data?.total || 0)
  return { success: true, withdrawals, total }
}
