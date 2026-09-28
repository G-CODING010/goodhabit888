const CACHE_NAME = 'aura-tracker-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Sarabun:wght@300;400;600;700&display=swap'
];

// เมื่อติดตั้ง Service Worker ให้ทำการ Cache ไฟล์ที่จำเป็นไว้
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ลบ Cache เก่าทิ้งเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// เมื่อมีการดึงข้อมูล ให้ดึงจาก Cache ก่อน ถ้าไม่มีค่อยดึงจาก Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
