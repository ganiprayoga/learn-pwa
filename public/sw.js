
self.addEventListener('install', function (event) {
  console.log('[Console Worker] Installing Service Worker ...', event);
});

self.addEventListener('activate', function (event) {
  console.log('[Console Worker] Activating Service Worker ...', event);
});

self.addEventListener('fetch', function (event) {
  console.log('[Service Worker] Fetching Someting ....', event);
  event.respondWith(fetch(event.request));
});