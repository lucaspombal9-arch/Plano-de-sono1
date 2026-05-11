// ============================================================
// SERVICE WORKER — Plano de Sono Atleta
// v2 — Cache offline + Notificações push locais às 21:00
// ============================================================

const CACHE_NAME = 'plano-sono-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.ico',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap'
];

// ─── Estado interno do SW ─────────────────────────────────
// Guarda a data da última notificação enviada (formato YYYY-MM-DD)
let lastNotifiedDate = null;

// ─── INSTALL ──────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE ─────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => {
      self.clients.claim();
      // Inicia o loop de verificação quando o SW ativa
      startNotificationLoop();
    })
  );
});

// ─── FETCH ────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (!request.url.startsWith('http')) return;

  if (
    request.destination === 'font' ||
    request.destination === 'image' ||
    url.hostname === 'fonts.gstatic.com' ||
    url.hostname === 'fonts.googleapis.com'
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// ─── NOTIFICAÇÃO: função central ──────────────────────────
function getTodayString() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

function shouldNotify() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const today = getTodayString();

  // Dispara entre 21:00 e 21:01, e apenas uma vez por dia
  return hour === 21 && minute === 0 && lastNotifiedDate !== today;
}

function fireNotification() {
  const today = getTodayString();
  lastNotifiedDate = today;

  return self.registration.showNotification('Plano de Sono 🌙', {
    body: 'Hora de dormir, craque! Inicie sua rotina de desaceleração agora.',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    vibrate: [200, 100, 200, 100, 400],
    tag: 'sono-21h',           // evita notificações duplicadas
    renotify: false,
    requireInteraction: false,
    data: { url: self.registration.scope }
  });
}

// ─── LOOP interno do SW (verifica a cada 30s) ─────────────
// Atenção: browsers podem "matar" o SW quando ocioso.
// Por isso existe também o disparo via postMessage da página.
function startNotificationLoop() {
  setInterval(() => {
    if (shouldNotify()) {
      fireNotification();
    }
  }, 30 * 1000); // 30 segundos
}

// ─── MESSAGE: recebe sinal da página ──────────────────────
// A página envia { type: 'CHECK_NOTIFY' } a cada minuto via postMessage.
// Isso mantém as notificações funcionando enquanto o app estiver aberto.
self.addEventListener('message', event => {
  if (!event.data) return;

  if (event.data.type === 'CHECK_NOTIFY') {
    if (shouldNotify()) {
      fireNotification();
    }
  }

  // Permite forçar notificação de teste via DevTools
  if (event.data.type === 'TEST_NOTIFY') {
    self.registration.showNotification('Plano de Sono 🌙 [TESTE]', {
      body: 'Hora de dormir, craque! Inicie sua rotina de desaceleração agora.',
      icon: './icons/icon-192.png',
      vibrate: [200, 100, 200, 100, 400],
      tag: 'sono-teste',
      data: { url: self.registration.scope }
    });
  }
});

// ─── NOTIFICATION CLICK: abre o app ───────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : self.registration.scope;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Se o app já estiver aberto, foca nele
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Senão, abre uma nova janela
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// ─── Inicia o loop ao carregar o SW pela primeira vez ─────
startNotificationLoop();
