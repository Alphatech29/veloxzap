import { apiFetch } from './api'

export async function submitSupportTicket({ subject, message }) {
  return apiFetch('/api/v1/users/support/ticket', {
    method: 'POST',
    body: JSON.stringify({ subject, message }),
  })
}
