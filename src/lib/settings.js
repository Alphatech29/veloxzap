import { apiFetch } from './api'

export async function getWebSettings() {
  const result = await apiFetch('/api/v1/general/setting', { method: 'GET' })
  if (!result.success) return { success: false, settings: null, message: result.message }
  return { success: true, settings: result.data ?? null }
}
