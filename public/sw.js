self.addEventListener('push', event => {
  const data = event.data?.json() ?? {}
  const title = data.title || 'VeloxZap'
  const options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '/logo-1.png',
    badge: data.badge || '/logo-1.png',
    tag: data.tag || 'veloxzap',
    vibrate: [200, 100, 200],
    data: data.data || {},
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes(url) && 'focus' in c)
      if (existing) return existing.focus()
      return clients.openWindow(url)
    })
  )
})
