// Jazzapp Service Worker - v3
const basePath = self.location.pathname.substring(0, self.location.pathname.lastIndexOf('/') + 1);
const CACHE_NAME = 'jazzapp-cache-v3';

const ASSETS_TO_CACHE = [
  basePath,
  basePath + 'index.html',
  basePath + 'manifest.json',
  basePath + 'icons/coffee-icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Pre-cache partial fallback:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Purging legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  // HTML navigation: Network-first to always get latest version, fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const fallback = await caches.match(basePath + 'index.html');
          return fallback || fetch(event.request);
        })
    );
    return;
  }

  // Static assets: Cache-first, then network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch((err) => {
        console.warn('Network fetch failed for asset:', event.request.url, err);
        return cachedResponse;
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, tag, icon } = event.data;
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        self.registration.showNotification(title, {
          body,
          icon: icon || (basePath + 'icons/coffee-icon.svg'),
          badge: basePath + 'icons/coffee-icon.svg',
          tag: tag || 'bill-reminder',
          vibrate: [200, 100, 200],
          requireInteraction: true
        });
      } catch (e) {
        console.warn('Error showing notification from SW:', e);
      }
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow(basePath);
    })
  );
});
