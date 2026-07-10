import { apiFetch } from '../lib/api'

export async function fetchNotifications({ limit = 20, offset = 0 } = {}) {
  const result = await apiFetch(`/api/v1/users/notifications?limit=${limit}&offset=${offset}`, { method: 'GET' })
  if (!result.success) {
    return { success: false, message: result.message }
  }
  return { success: true, notifications: result.data?.notifications ?? [] }
}

export async function fetchUnreadNotificationCount() {
  const result = await apiFetch('/api/v1/users/notifications/unread-count', { method: 'GET' })
  if (!result.success) {
    return { success: false, message: result.message }
  }
  return { success: true, count: result.data?.count ?? 0 }
}

export async function markNotificationRead(id) {
  const result = await apiFetch(`/api/v1/users/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' })
  if (!result.success) {
    return { success: false, message: result.message }
  }
  return { success: true }
}

export async function markAllNotificationsRead() {
  const result = await apiFetch('/api/v1/users/notifications/read-all', { method: 'POST' })
  if (!result.success) {
    return { success: false, message: result.message }
  }
  return { success: true }
}
