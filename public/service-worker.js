const CACHE_NAME = 'terra-das-aguas-cache-v1';
const URLS_TO_CACHE = ['/', '/index.html'];

// instala e faz cache básico
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting()),
  );
});

// ativa e remove caches antigos se trocar versão
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      ),
    ),
  );
  self.clients.claim();
});

// estratégia básica: cache-first para navegação e assets estáticos
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // só GET
  if (request.method !== 'GET') return;

  // não tenta cachear chamadas da API (deixa pro axios)
  if (request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          // futuramente, podemos servir uma página offline customizada
          return caches.match('/');
        });
    }),
  );
});
