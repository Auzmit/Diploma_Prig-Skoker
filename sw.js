const CACHE_NAME = 'prig-skoker-v1';

// список файлов, которые игра точно использует
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './js/index.js',

  // sprites
    // clouds
      // left
      './resources/images/clouds/cloud-left-1.png',
      './resources/images/clouds/cloud-left-2.png',
      './resources/images/clouds/cloud-left-3.png',
      './resources/images/clouds/cloud-left-4.png',
      './resources/images/clouds/cloud-left-5.png',
      './resources/images/clouds/cloud-left-6.png',
      // right
      './resources/images/clouds/cloud-right-1.png',
      './resources/images/clouds/cloud-right-2.png',
      './resources/images/clouds/cloud-right-3.png',
      './resources/images/clouds/cloud-right-4.png',
      './resources/images/clouds/cloud-right-5.png',
      './resources/images/clouds/cloud-right-6.png',
      // transparent
      './resources/images/clouds/transparent_1x1.png',
    // colored clouds
      // left
      './resources/images/clouds/colored/cloud-left-1-black.png',
      './resources/images/clouds/colored/cloud-left-1-blue.png',
      './resources/images/clouds/colored/cloud-left-1-green.png',
      './resources/images/clouds/colored/cloud-left-1-grey.png',
      './resources/images/clouds/colored/cloud-left-1-red.png',
      './resources/images/clouds/colored/cloud-left-1-yellow.png',
      // right
      './resources/images/clouds/colored/cloud-right-1-black.png',
      './resources/images/clouds/colored/cloud-right-1-blue.png',
      './resources/images/clouds/colored/cloud-right-1-green.png',
      './resources/images/clouds/colored/cloud-right-1-grey.png',
      './resources/images/clouds/colored/cloud-right-1-red.png',
      './resources/images/clouds/colored/cloud-right-1-yellow.png',
    // head (left & right)
    './resources/images/head-left-stroke.png',
    './resources/images/head-right-stroke.png',

  // sounds
    // death
    './resources/sounds/death/-blin-zachem-ya-syuda-prishel.mp3',
    './resources/sounds/death/ay-menya-snaypnuli-v-polte.mp3',
    './resources/sounds/death/bolno-v-noge.mp3',
    './resources/sounds/death/brue.mp3',
    './resources/sounds/death/da-idi-tyi.mp3',
    './resources/sounds/death/daladna.mp3',
    './resources/sounds/death/davai-po-novoi-misha.mp3',
    './resources/sounds/death/eralash.mp3',
    './resources/sounds/death/eto-fiasko-bratan.mp3',
    './resources/sounds/death/golos-beshenogo-gitlera-iz-mema-kotoryiy-nesoglasen.mp3',
    './resources/sounds/death/grustnaya-violonchel.mp3',
    './resources/sounds/death/kto-kuda-a-ya-po-delam.mp3',
    './resources/sounds/death/ne-nihya.mp3',
    './resources/sounds/death/nepravilno-poprobuy-esch-raz.mp3',
    './resources/sounds/death/nope.mp3',
    './resources/sounds/death/nu-che-narod-pognali1.mp3',
    './resources/sounds/death/nu-naher.mp3',
    './resources/sounds/death/o-kurva.mp3',
    './resources/sounds/death/pojili-i-hvatit.mp3',
    './resources/sounds/death/vot-eto-povorot.mp3',
    './resources/sounds/death/vsego-horoshego.mp3',
    './resources/sounds/death/ya-maslinu-poymal.mp3',
    // trampoline_jumps
    './resources/sounds/trampoline_jumps/0.mp3',
    './resources/sounds/trampoline_jumps/1.mp3',
    './resources/sounds/trampoline_jumps/2.mp3',
    // other
    './resources/sounds/click_button.mp3',
    './resources/sounds/explosion.mp3',
    './resources/sounds/puk_air-jump.mp3',
    './resources/sounds/swipe.mp3'
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
        // кешируем «на лету» только GET‑запросы
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
