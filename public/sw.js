// Winear.me service worker: makes the site installable and opens it fast.
// Pages and data: network first (always fresh), saved copy when offline.
// Map library and icons: saved copy first. Map tiles are not stored.
const CACHE = "winear-v8";
const CORE = ["/", "/offline.html", "/leaflet.js", "/leaflet.css", "/topojson-client.min.js", "/icons/icon-192.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (/leaflet|topojson|\/icons\//.test(url.pathname)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    })));
    return;
  }
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(r =>
    r || (req.mode === "navigate" ? caches.match("/offline.html") : Response.error()))));
});
