const CACHE_NAME = "goto3d-v1";
// const urlsToCache = ["/", "/styles/main.css", "/scripts/main.js"];

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  // event.waitUntil(
  //   caches.open(CACHE_NAME)
  //     .then((cache) => {
  //       return cache.addAll(urlsToCache);
  //     })
  // );
});

self.addEventListener("fetch", (event) => {
  console.log("Service Worker fetching.");
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     if (response) {
  //       return response;
  //     }
  //     return fetch(event.request);
  //   }),
  // );
});
