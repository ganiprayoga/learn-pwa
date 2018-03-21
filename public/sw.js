
self.addEventListener('install', function (event) {
  console.log('[Console Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open('static')
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/index.html',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/promise.js',
          '/src/js/fetch.js',
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/images/main-image.jpg'
        ]);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('[Console Worker] Activating Service Worker ...', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request);
        }
      })
  );
});