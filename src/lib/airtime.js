import { apiFetch } from './api'

// Maps frontend network IDs → VTPass serviceID
const SERVICE_ID_MAP = {
  mtn:      'mtn',
  airtel:   'airtel',
  glo:      'glo',
  t2mobile: 'etisalat',
}

// Reverse: VTPass serviceID → frontend network ID
const SERVICE_ID_REVERSE = Object.fromEntries(
  Object.entries(SERVICE_ID_MAP).map(([k, v]) => [v, k])
)

export async function purchaseAirtime({ phone, amount, network, pin }) {
  const serviceId = SERVICE_ID_MAP[network]
  if (!serviceId) {
    return { success: false, message: 'Unknown network provider.' }
  }

  const result = await apiFetch('/api/v1/users/purchaseAirtime', {
    method: 'POST',
    body: { number: phone, amount, serviceId, pin },
  })

  if (!result.success) {
    return { success: false, message: result.message || 'Airtime purchase failed.' }
  }

  return { success: true, message: result.message, data: result.data }
}

export async function getRecentAirtimeNumbers() {
  const result = await apiFetch('/api/v1/users/recent-airtime', { method: 'GET' })
  if (!result.success) return { success: false, numbers: [] }

  // Deduplicate by phone — rows are already ordered by last_used DESC so first wins
  const seen = new Set()
  const numbers = (result.data ?? [])
    .map(row => ({ phone: row.phone_number, net: SERVICE_ID_REVERSE[row.service_id] ?? row.service_id }))
    .filter(r => { if (seen.has(r.phone)) return false; seen.add(r.phone); return true })

  return { success: true, numbers }
}
