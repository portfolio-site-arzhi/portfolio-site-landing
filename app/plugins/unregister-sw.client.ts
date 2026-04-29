export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator)) return

  const key = 'sw_unregistered_v1'
  if (sessionStorage.getItem(key)) return

  navigator.serviceWorker.getRegistrations().then(async (registrations) => {
    if (!registrations.length) return

    await Promise.all(registrations.map((r) => r.unregister()))

    if ('caches' in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    }

    sessionStorage.setItem(key, '1')
    window.location.reload()
  }).catch(() => {})
})

