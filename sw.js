const CACHE_NAME = 'prig-skoker-v1';

// список файлов, которые игра точно использует
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './js/index.js',
];

// установка: предзагрузка ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// активация: очистка старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)   
          .map(key => caches.delete(key))
      )
    )
  );
});

// перехват запросов: сначала кэш, потом сеть
self.addEventListener('fetch', (event) => {
  const request = event.request;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        // кешируем на лету только GET‑запросы
        if (
          request.method === 'GET' &&
          response &&
          response.status === 200 &&
          response.type === 'basic'
        ) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});
