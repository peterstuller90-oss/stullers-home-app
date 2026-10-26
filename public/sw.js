// Service worker: lets the app open fast from the iPhone home screen and show
// its screens even on a weak signal. Family data always comes live from Supabase
// (other origins are never cached), so every phone sees the same tasks and points.
const CACHE = 'stullers-home-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(self.registration.scope)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key)
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return

  // Pages: always try the network first so a new version shows up right away.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req)
        const cache = await caches.open(CACHE)
        await cache.put(self.registration.scope, res.clone())
        return res
      } catch {
        return (await caches.match(self.registration.scope)) ?? Response.error()
      }
    })())
    return
  }

  // Scripts, styles, fonts and icons: built files have unique names, so the cached copy is safe.
  event.respondWith((async () => {
    const cached = await caches.match(req)
    if (cached) return cached
    const res = await fetch(req)
    if (res.ok) (await caches.open(CACHE)).put(req, res.clone())
    return res
  })())
})
