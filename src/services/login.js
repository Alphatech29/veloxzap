import { apiFetch } from '../lib/api'

export async function login({ email, password }) {
  const result = await apiFetch('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
  })

  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Login failed. Please try again.',
      code: result.code || `HTTP_${result.status}`,
      status: result.status,
    }
  }

  return {
    success: true,
    user: result.data?.user ?? null,
    message: result.message,
  }
}
