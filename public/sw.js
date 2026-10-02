// Service worker: offline fallback, push notifications, and automatic SPA routing
const CACHE = 'gfss-v3';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // Pages / Navigations: network first; if 404 or offline, serve index.html
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (!res.ok && res.status === 404) {
            return caches.match('/index.html').then((hit) => hit || caches.match('/')).then((hit) => hit || fetch('/'));
          }
          return res;
        })
        .catch(() => caches.match('/index.html').then((hit) => hit || caches.match('/')).then((hit) => hit || fetch('/')))
    );
    return;
  }
  // Static assets: cache first, then network (and cache the result)
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }))
  );
});

// Native Push Notifications
self.addEventListener('push', (e) => {
  let data = { title: 'Greenfield Secondary School', body: 'New circular from school administration.', url: '/app/home' };
  try {
    if (e.data) data = { ...data, ...e.data.json() };
  } catch {
    if (e.data) data.body = e.data.text();
  }
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/app/home' },
  };
  e.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const targetUrl = e.notification.data?.url || '/app/home';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/app') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
