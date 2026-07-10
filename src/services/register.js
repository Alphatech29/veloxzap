import { apiFetch } from '../lib/api'

export async function register({
  fullName,
  email,
  country,
  phone,
  password,
  referral,
}) {
  const result = await apiFetch('/api/v1/auth/create-user', {
    method: 'POST',
    body: {
      fullname: fullName,
      email,
      country,
      phone,
      password,
      referral_code: referral || undefined,
    },
  })

  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Registration failed. Please try again.',
      status: result.status,
    }
  }

  return {
    success: true,
    uid: result.data?.uid ?? null,
    message: result.message,
  }
}
