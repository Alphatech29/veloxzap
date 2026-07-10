import { apiFetch } from '../lib/api'

export async function convertCurrency({ amount, from }) {
  const result = await apiFetch('/api/v1/users/convert', {
    method: 'POST',
    body: { amount, from },
  })
  if (!result.success) return { success: false, message: result.message || 'Conversion failed.' }
  return { success: true, data: result.data }
}

export async function getConversionHistory({ limit = 5 } = {}) {
  const result = await apiFetch(`/api/v1/users/convert/history?limit=${limit}`, { method: 'GET' })
  if (!result.success) return { success: false, conversions: [] }
  return { success: true, conversions: result.data?.conversions ?? [] }
}
