const CACHE_VERSION = "yamar-static-v1";

const PRECACHE_URLS = [
  "/manifest.webmanifest",
  "/icons/yamar-192.png",
  "/icons/yamar-512.png",
  "/icons/yamar-maskable-192.png",
  "/icons/yamar-maskable-512.png",
  "/icons/yamar-apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((cacheNames) =>
          Promise.all(
            cacheNames
              .filter(
                (cacheName) =>
                  cacheName.startsWith("yamar-") &&
                  cacheName !== CACHE_VERSION
              )
              .map((cacheName) =>
                caches.delete(cacheName)
              )
          )
        ),
      self.clients.claim(),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    return;
  }

  if (request.mode === "navigate") {
    return;
  }

  const isNextStaticAsset =
    url.pathname.startsWith("/_next/static/");

  const isPwaIcon =
    url.pathname.startsWith("/icons/");

  const isManifest =
    url.pathname === "/manifest.webmanifest";

  if (
    !isNextStaticAsset &&
    !isPwaIcon &&
    !isManifest
  ) {
    return;
  }

  event.respondWith(
    caches
      .match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then(
          (networkResponse) => {
            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type !== "basic"
            ) {
              return networkResponse;
            }

            const responseToCache =
              networkResponse.clone();

            caches
              .open(CACHE_VERSION)
              .then((cache) => {
                cache.put(
                  request,
                  responseToCache
                );
              });

            return networkResponse;
          }
        );
      })
  );
});