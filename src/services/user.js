import { apiFetch } from '../lib/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function resolveAvatarUrl(path) {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

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
  const raw = result.data ?? null
  const user = raw ? { ...raw, avatar: resolveAvatarUrl(raw.avatar) } : null
  return { success: true, user, message: result.message }
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

export async function changePassword({ oldPassword, newPassword }) {
  const result = await apiFetch('/api/v1/auth/change-password', {
    method: 'PUT',
    body: { oldPassword, newPassword },
  })
  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Could not change password.',
      code: result.code,
    }
  }
  return { success: true, message: result.message }
}

export async function createPin({ pin }) {
  const result = await apiFetch('/api/v1/users/create-pin', {
    method: 'POST',
    body: { pin },
  })
  if (!result.success) return { success: false, message: result.message || 'Could not create PIN.' }
  return { success: true, message: result.message }
}

export async function changePin({ oldPin, newPin }) {
  const result = await apiFetch('/api/v1/users/change-pin', {
    method: 'POST',
    body: { oldPin, newPin },
  })
  if (!result.success) return { success: false, message: result.message || 'Could not change PIN.' }
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
  formData.append('image', file)

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
    avatar: resolveAvatarUrl(result.data?.avatar) ?? null,
    message: result.message,
  }
}
