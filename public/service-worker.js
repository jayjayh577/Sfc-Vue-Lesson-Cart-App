var cacheName = "lessonstore-v1";
var cacheFiles = [
    "index.html",
    //"products.js",
];


self.addEventListener("fetch", function(e) {
    e.respondWith(
      caches.match(e.request).then(function(cachedFile) {
        // If the file is in the cache, retrieve it from there
        if (cachedFile) {
          console.log("[Service Worker] Resource fetched from the cache for: " + e.request.url);
          return cachedFile;
        } else {
          // If the request scheme is not supported, just fetch the resource directly
          if (e.request.url.startsWith('chrome-extension://')) {
            console.log("[Service Worker] Skipping cache for request with unsupported scheme: " + e.request.url);
            return fetch(e.request);
          }
          
          // If the file is not in the cache, download the file
          return fetch(e.request).then(function(response) {
            return caches.open(cacheName).then(function(cache) {
              // Add the new file to the cache
              cache.put(e.request, response.clone());
              console.log("[Service Worker] Resource fetched and saved in the cache for: " + e.request.url);
              return response;
            });
          });
        }
      })
    );
  });
  
  