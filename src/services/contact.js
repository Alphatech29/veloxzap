import { apiFetch } from '../lib/api'

export async function submitContactMessage({ name, email, topic, message }) {
  return apiFetch('/api/v1/general/contact', {
    method: 'POST',
    body: { name, email, topic, message },
  })
}
