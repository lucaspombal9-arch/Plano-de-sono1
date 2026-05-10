// ============================================================
//  SERVICE WORKER — Plano de Sono Atleta PWA
//  Estratégia: Cache First para assets estáticos,
//              Network First com fallback para o HTML principal
// ============================================================

const CACHE_NAME = 'sono-atleta-v1';
const OFFLINE_URL = './index.html';

// Todos os assets que serão cacheados no install
const PRECACHE_ASSETS = [
  './index.html',
  './manifest.json',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32x32.png',
  './icons/favicon-16x16.png',
  // Google Fonts serão cacheados em runtime
];

// ──────────────────────────────────────────
//  INSTALL — pré-carrega o cache essencial
// ──────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching assets...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      console.log('[SW] Install completo — assets em cache.');
      return self.skipWaiting(); // Ativa imediatamente sem esperar
    })
  );
});

// ──────────────────────────────────────────
//  ACTIVATE — limpa caches de versões antigas
// ──────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Removendo cache antigo:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activate completo — controlando todos os clientes.');
      return self.clients.claim(); // Assume controle de todas as abas abertas
    })
  );
});

// ──────────────────────────────────────────
//  FETCH — estratégia de cache inteligente
// ──────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requests não-GET e extensões do Chrome
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Google Fonts: Cache First (raramente mudam)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML principal: Network First com fallback offline
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Todos os outros assets: Cache First com atualização em background
  event.respondWith(staleWhileRevalidate(request));
});

// ──────────────────────────────────────────
//  ESTRATÉGIAS DE CACHE
// ──────────────────────────────────────────

// Cache First: tenta o cache, vai à rede se não encontrar
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.warn('[SW] Cache First falhou:', err);
    return new Response('Offline', { status: 503 });
  }
}

// Network First com fallback para cache/offline
async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback para o index.html offline
    const offlinePage = await caches.match(OFFLINE_URL);
    return offlinePage || new Response(
      '<h1>Sem conexão</h1><p>Abra o app novamente quando tiver internet.</p>',
      { headers: { 'Content-Type': 'text/html' }, status: 503 }
    );
  }
}

// Stale While Revalidate: serve do cache instantaneamente + atualiza em background
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const networkFetch = fetch(request).then((response) => {
    if (response && response.status === 200 && response.type !== 'opaque') {
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
    }
    return response;
  }).catch(() => null);

  return cached || await networkFetch || new Response('Offline', { status: 503 });
}

// ──────────────────────────────────────────
//  SYNC — Background Sync (futuro uso)
// ──────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
