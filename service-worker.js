// Minimal cache-first service worker so the game works offline once
// it has been opened at least once. Bump CACHE_VERSION whenever the
// app shell changes — old caches are cleaned up on activate.

const CACHE_VERSION = 'ice-kingdom-v1';

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/css/style.css',
  '/js/main.js',
  '/js/locale.js',
  '/js/controls.js',
  '/js/particles.js',
  '/js/sfx.js',
  '/js/characters.js',
  '/js/levelgen.js',
  '/js/scenes/BootScene.js',
  '/js/scenes/TitleScene.js',
  '/js/scenes/CharacterSelectScene.js',
  '/js/scenes/ForestScene.js',
  '/js/scenes/ParkourScene.js',
  '/js/scenes/WinScene.js',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon-180.png',
  'https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // Add resources one-by-one so a single 404 doesn't poison the install
      Promise.all(
        APP_SHELL.map((url) =>
          cache.add(new Request(url, { mode: url.startsWith('http') ? 'no-cors' : 'cors' }))
            .catch(() => null)
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Cache same-origin and CDN tile/sprite assets opportunistically
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});
