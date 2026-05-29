const CACHE_NAME = 'mel-v2-cache-v7';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './cropper.min.css',
  './cropper.min.js',
  './cutting.html',
  './efek-levels.html',
  './grafir-foto.html',
  './kalkulator.html',
  './melingkar.html'
];

// 1. Install Service Worker & Simpan file ke Memori HP/PC
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); 
});

// 🚀 SUNTIKAN SAKTI 1: FUNGSI PENGGUSUR CACHE LAMA (WAJIB ADA!)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // Kalau ada cache nama lama (kayak v6, v5, dll), langsung Bantai & Hapus!
          if (cache !== CACHE_NAME) {
            console.log(' Memori jadul ' + cache + ' resmi digusur dari ruko!');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Paksa semua halaman detik ini juga pakai v7!
  );
});

// 2. Ambil file dari Memori kalau lagi Offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(err => {
        console.log("Aset luar gagal di-fetch, tapi aplikasi tetep aman jalan terus!");
        return new Response(''); 
      });
    })
  );
});
