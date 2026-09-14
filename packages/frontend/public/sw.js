// Minimal service worker for push notifications on mobile
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) =>
  event.waitUntil(self.clients.claim()),
)

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes('/menu') && 'focus' in client) {
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        // scope is the deployed base path (e.g. https://host/cafe/)
        return self.clients.openWindow(
          new URL('menu/orders', self.registration.scope).href,
        )
      }
    }),
  )
})
