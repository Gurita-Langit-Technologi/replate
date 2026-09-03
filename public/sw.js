const CACHE_NAME = 'replate-v1';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/image/logo(2).png',
    '/image/logo.png',
    '/favicon.ico',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch(() => {});
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests for images or static assets
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Cache first for static images and logos
    if (url.pathname.startsWith('/image/') || url.pathname.endsWith('.png') || url.pathname.endsWith('.ico')) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                return cached || fetch(event.request).then((response) => {
                    const cloned = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
                    return response;
                });
            })
        );
        return;
    }

    // Network first for all dynamic pages
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
