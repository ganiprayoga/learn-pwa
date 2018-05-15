
var CACHE_STATIC_NAME   = 'static-v2';
var CACHE_DYNAMIC_NAME  = 'dynamic-v2';
var CACHE_NO_CORS       = 'nocors-v2';

var noCORSURL = [
  'https://code.getmdl.io/1.3.0/material.purple-yellow.min.css'
];

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
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
          '/src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons'
        ]);
      })
  );
  event.waitUntil(
    caches.open(CACHE_NO_CORS)
      .then(function (cache) {
        console.log('[Service Worker] Opened Cache.');
        cache.addAll(noCORSURL.map(function (url) {
          console.log(url);
          // cache.add(url);
          return new Request(url, {mode: 'no-cors'});
        })).then(function () {
          console.log('All Resources have been fetched and Cached');
        })
      })
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }))
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  //cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function (err) {

            });
        }
      })
  );
});