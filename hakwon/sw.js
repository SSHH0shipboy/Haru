/* 하원 정산 V 1.2.0 by S.H.KIM — 오프라인 실행용. 인터넷이 되면 항상 최신 버전을 먼저 받는다(업데이트 자동 반영). */
const CACHE = 'hakwon-1.2.0';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
});
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('hakwon-') && k !== CACHE) await caches.delete(k); // 이 앱 캐시만 정리
  await self.clients.claim();
})()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  const font = /^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (u.origin !== location.origin && !font) return;
  if (!font && !u.pathname.startsWith(new URL('./', self.registration.scope).pathname)) return;
  e.respondWith(fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(m => m || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});
