/* Pediatric Sleep Diary — service worker.
   Cache-first app shell so the diary opens instantly and fully offline
   (parents log at 6 AM with no signal). Bump CACHE_VERSION on any release
   so installed phones pick up the new files on their next online visit. */
const CACHE_VERSION = "peds-sleep-diary-v2.1.2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never intercept Google APIs etc.

  // Stale-while-revalidate: serve from cache, refresh in the background.
  event.respondWith(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: req.mode === "navigate" });
      const refresh = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      if (cached) { event.waitUntil(refresh); return cached; }
      const fresh = await refresh;
      if (fresh) return fresh;
      // Offline and uncached: fall back to the app shell for navigations.
      if (req.mode === "navigate") {
        const shell = await cache.match("./index.html");
        if (shell) return shell;
      }
      return Response.error();
    })
  );
});
