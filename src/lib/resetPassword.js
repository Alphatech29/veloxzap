import { apiFetch } from './api'

export async function resetPassword({ token, password }) {
  const result = await apiFetch('/api/v1/auth/resetPassword', {
    method: 'POST',
    body: { token, password },
  })

  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Something went wrong. Please try again.',
      status: result.status,
    }
  }

  return {
    success: true,
    message: result.message,
  }
}
