// An old service worker of the site's own shape (public/sw.js before the kill switch), from before pages were fetched
// network-first: everything, the page included, is answered from its cache when the cache holds it. Served by
// e2e/old-worker.spec.js as an "old site" only; never published. Its network-first successor is sw-network-first.js
// (public/sw.js as it was until the kill switch replaced it).
const CACHE_NAME = 'pension-planner-v17';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon.png',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => (cacheName !== CACHE_NAME ? caches.delete(cacheName) : null))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request).then(fresh => {
        if (fresh && fresh.status === 200 && fresh.type === 'basic') {
          const copy = fresh.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return fresh;
      }))
      .catch(() => caches.match('./index.html'))
  );
});
