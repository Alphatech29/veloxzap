import { apiFetch } from './api'

export async function getCurrentUser() {
  const result = await apiFetch('/api/v1/users/user', { method: 'GET' })
  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Could not load your profile.',
      code: result.code,
      status: result.status,
    }
  }
  return { success: true, user: result.data ?? null, message: result.message }
}

export async function getWallet() {
  const result = await apiFetch('/api/v1/users/wallet', { method: 'GET' })
  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Could not load your wallet.',
      code: result.code,
      status: result.status,
    }
  }
  return { success: true, wallet: result.data ?? null, message: result.message }
}

export async function getDedicatedAccount() {
  const result = await apiFetch('/api/v1/users/dedicated-account', { method: 'GET' })
  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Could not load your dedicated account.',
      code: result.code,
      status: result.status,
    }
  }
  return { success: true, account: result.data ?? null, message: result.message }
}

export async function updateCountry(country) {
  const result = await apiFetch('/api/v1/users/update/country', {
    method: 'PUT',
    body: { country },
  })
  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Could not update country.',
      code: result.code,
      status: result.status,
    }
  }
  return { success: true, message: result.message }
}

export async function updateAvatar(file) {
  if (!(file instanceof File || file instanceof Blob)) {
    return {
      success: false,
      message: 'Please select a valid image file.',
      code: 'INVALID_FILE',
    }
  }

  const formData = new FormData()
  formData.append('file', file)

  const result = await apiFetch('/api/v1/users/update/avatar', {
    method: 'PUT',
    body: formData,
  })

  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Could not update avatar.',
      code: result.code,
      status: result.status,
    }
  }

  return {
    success: true,
    avatar: result.data?.avatar ?? null,
    message: result.message,
  }
}
