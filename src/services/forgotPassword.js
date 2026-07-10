import { apiFetch } from '../lib/api'

export async function forgotPassword({ email }) {
  const result = await apiFetch('/api/v1/auth/forgotPassword', {
    method: 'POST',
    body: { email },
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
