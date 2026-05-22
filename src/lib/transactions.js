import { apiFetch } from './api'

export async function fetchHistory() {
  const result = await apiFetch('/api/v1/users/history', { method: 'GET' })

  if (result.status === 404) return { success: true, rows: [] }

  // Response arrives as [{success, data: {transactions: []}}] (array-wrapped)
  // or as {success, data: {transactions: []}} (standard envelope via apiFetch)
  const envelope = Array.isArray(result.payload) ? result.payload[0] : null
  const rows = envelope?.data?.transactions
    ?? result.data?.transactions
    ?? []

  return { success: true, rows }
}
