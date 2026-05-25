import { apiFetch } from './api'

export async function verifySmartcard({ billersCode, serviceID }) {
  const params = new URLSearchParams({ billersCode, serviceID })
  return apiFetch(`/api/v1/users/verify-smartcard?${params}`, { method: 'GET' })
}

export async function getTvVariations(serviceID) {
  return apiFetch(`/api/v1/users/tv-variations/${serviceID}`, { method: 'GET' })
}

export async function changeBouquet({ billersCode, serviceID, variation_code, amount, phone, pin }) {
  return apiFetch('/api/v1/users/change-bouquet', {
    method: 'POST',
    body: JSON.stringify({ billersCode, serviceID, variation_code, amount, phone, pin }),
  })
}

export async function renewBouquet({ billersCode, serviceID, variation_code, amount, phone, pin }) {
  return apiFetch('/api/v1/users/renew-bouquet', {
    method: 'POST',
    body: JSON.stringify({ billersCode, serviceID, variation_code, amount, phone, pin }),
  })
}
