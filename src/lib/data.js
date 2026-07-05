import { apiFetch } from './api'

// Maps frontend network IDs → VTPass serviceID for data
const SERVICE_ID_MAP = {
  mtn:      'mtn-data',
  airtel:   'airtel-data',
  glo:      'glo-data',
  t2mobile: 'etisalat-data',
}

// Reverse: VTPass serviceID → frontend network ID
const SERVICE_ID_REVERSE = Object.fromEntries(
  Object.entries(SERVICE_ID_MAP).map(([k, v]) => [v, k])
)

export async function getDataVariations(network) {
  const serviceID = SERVICE_ID_MAP[network]
  if (!serviceID) return { success: false, data: [] }

  const result = await apiFetch(`/api/v1/users/data-variations/${serviceID}`, { method: 'GET' })
  if (!result.success) return { success: false, data: [] }

  return { success: true, data: result.data ?? [] }
}

export async function purchaseData({ phone, network, variationCode, amount, planName, pin }) {
  const serviceID = SERVICE_ID_MAP[network]
  if (!serviceID) {
    return { success: false, message: 'Unknown network provider.' }
  }

  const result = await apiFetch('/api/v1/users/purchaseData', {
    method: 'POST',
    body: { phone, serviceID, variation_code: variationCode, amount, plan_name: planName, pin },
  })

  if (!result.success) {
    return { success: false, message: result.message || 'Data purchase failed.' }
  }

  return { success: true, message: result.message, data: result.data }
}

export async function getRecentDataNumbers() {
  const result = await apiFetch('/api/v1/users/recent-data', { method: 'GET' })
  if (!result.success) return { success: false, numbers: [] }

  const seen = new Set()
  const numbers = (result.data ?? [])
    .map(row => ({ phone: row.phone_number, net: SERVICE_ID_REVERSE[row.service_id] ?? row.service_id }))
    .filter(r => { if (seen.has(r.phone)) return false; seen.add(r.phone); return true })

  return { success: true, numbers }
}
