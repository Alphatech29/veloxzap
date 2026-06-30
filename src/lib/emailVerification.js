import { apiFetch } from './api'

export async function sendEmailVerificationLink() {
  const result = await apiFetch('/api/v1/auth/resend-verification', {
    method: 'POST',
  })

  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Could not send verification email. Please try again.',
      status: result.status,
    }
  }

  return { success: true, message: result.message }
}

export async function verifyEmailLink({ token }) {
  const result = await apiFetch('/api/v1/auth/verify-email', {
    method: 'POST',
    body: { token },
  })

  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Invalid or expired verification link.',
      status: result.status,
    }
  }

  return { success: true, message: result.message }
}
