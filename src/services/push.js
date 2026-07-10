import { apiFetch } from '../lib/api'

function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

async function getVapidKey() {
  const res = await apiFetch('/api/v1/users/push/vapid-key')
  return res?.payload?.publicKey ?? null
}

async function syncToBackend(subscription) {
  await apiFetch('/api/v1/users/push/subscribe', {
    method: 'POST',
    body: { subscription },
  })
}

export async function subscribePush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
  try {
    const reg = await navigator.serviceWorker.ready
    const vapidKey = await getVapidKey()
    if (!vapidKey) return

    const existing = await reg.pushManager.getSubscription()
    if (existing) {
      syncToBackend(existing).catch(() => {})
      return
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    })
    await syncToBackend(subscription)
  } catch (err) {
    console.error('[push] subscribePush failed:', err)
  }
}

export async function unsubscribePush() {
  if (!('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (!sub) return
    await apiFetch('/api/v1/users/push/unsubscribe', {
      method: 'POST',
      body: { endpoint: sub.endpoint },
    }).catch(() => {})
    await sub.unsubscribe()
  } catch { /* ignore */ }
}
