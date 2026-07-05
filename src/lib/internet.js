import { apiFetch } from './api'

export async function verifySmileEmail(email) {
  return apiFetch('/api/v1/users/verify-smile-email', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function getInternetVariations(serviceID) {
  return apiFetch(`/api/v1/users/internet-variations/${serviceID}`, { method: 'GET' })
}

export async function purchaseInternet({ serviceID, billersCode, variation_code, amount, phone, email, planName, accountLabel, pin }) {
  return apiFetch('/api/v1/users/purchase-internet', {
    method: 'POST',
    body: JSON.stringify({
      serviceID, billersCode, variation_code, amount, phone,
      email, plan_name: planName, account_label: accountLabel,
      pin,
    }),
  })
}
