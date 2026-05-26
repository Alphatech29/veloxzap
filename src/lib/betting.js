import { apiFetch } from './api'

export async function validateBetting({ serviceID, betting_number }) {
  return apiFetch(`/api/v1/users/validate-betting?serviceID=${encodeURIComponent(serviceID)}&betting_number=${encodeURIComponent(betting_number)}`)
}

export async function purchaseBetting({ serviceID, billersCode, amount, pin }) {
  return apiFetch('/api/v1/users/purchase-betting', {
    method: 'POST',
    body: JSON.stringify({ serviceID, billersCode, amount, pin }),
  })
}
