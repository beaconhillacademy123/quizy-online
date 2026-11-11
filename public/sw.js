const CACHE = "quizy-shell-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(["/"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_")) return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && url.pathname === "/") {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("/", copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/"))),
  );
});
