const CACHE_NAME = 'nia-multiplication-v1';
// List all the files that need to be cached for offline use
const urlsToCache = [
  '/', // Alias for index.html
  '/index.html',
  '/css/style.css',
  '/js/SCORM_API_wrapper.js', // Keep if needed, though SCORM won't work offline
  '/js/script.js',
  '/js/introduction.js', // Added introduction.js
  '/js/facts.js',
  '/js/properties.js',
  '/js/tens.js',
  '/js/2digit.js',
  '/js/lattice.js',
  '/js/problems.js',
  '/js/word-problems.js',
  '/js/shopping.js',
  '/pages/introduction.html',
  '/pages/facts.html',
  '/pages/properties.html',
  '/pages/tens.html',
  '/pages/2digit.html',
  '/pages/lattice.html',
  '/pages/problems.html',
  '/pages/word-problems.html',
  '/pages/shopping.html',
  '/pages/rewards.html',
  '/images/icon-192.png', // Cache the icons
  '/images/icon-512.png'
  // Add any other essential assets like fonts or background images if you have them
];

// Install event: Cache files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting(); // Activate worker immediately
      })
      .catch(error => {
        console.error('Service Worker: Caching failed', error);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim(); // Take control of pages immediately
    })
  );
});

// Fetch event: Serve cached content when offline
self.addEventListener('fetch', event => {
  // console.log('Service Worker: Fetching', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          // console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }
        // Not in cache - fetch from network
        // console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request);
        // Optional: Cache new requests dynamically (be careful with this)
        /*
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
        */
      })
      .catch(error => {
          console.error('Service Worker: Fetch failed', error);
          // Optional: You could return a custom offline fallback page here
      })
  );
});
