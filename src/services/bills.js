import { apiFetch } from '../lib/api'

export async function verifyMeter({ billersCode, serviceID, type }) {
  const params = new URLSearchParams({ billersCode, serviceID, type })
  return apiFetch(`/api/v1/users/verify-meter?${params}`, { method: 'GET' })
}

export async function purchaseElectricity({ billersCode, serviceID, variation_code, amount, pin, phone = '' }) {
  return apiFetch('/api/v1/users/purchase-electricity', {
    method: 'POST',
    body: { billersCode, serviceID, variation_code, amount, pin, phone },
  })
}
