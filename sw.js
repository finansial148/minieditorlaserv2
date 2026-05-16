const CACHE_NAME = 'mel-v2-cache-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js'
];

// Install Service Worker & Simpan file ke Memori HP/PC
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  // Langsung aktifkan service worker baru tanpa nunggu browser ditutup
  self.skipWaiting(); 
});

// Ambil file dari Memori kalau lagi Offline, dan amankan fetch online
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 1. Kalau filenya ada di memori offline (index.html, cropper, dll), langsung pakai.
      if (response) {
        return response;
      }
      
      // 2. Kalau gak ada di memori, ambil online tapi dikasih pengaman (.catch) biar gak bikin macet
      return fetch(event.request).catch(err => {
        console.log("Aset luar gagal di-fetch, tapi aplikasi tetep aman jalan terus!");
        // Kembalikan respon kosong biar browser gak error merah merona
        return new Response(''); 
      });
    })
  );
});
