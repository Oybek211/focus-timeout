const CACHE_VERSION = "focus-timeout-v3";
const APP_SHELL = [
  "/",
  "/settings",
  "/statistics",
  "/about",
  "/help",
  "/offline.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/sounds/focus-start.wav",
  "/sounds/focus-end.wav",
  "/sounds/timeout-start.wav",
  "/sounds/timeout-end.wav",
  "/sounds/bell.wav",
  "/sounds/soft-chime.wav",
  "/sounds/triple-ding.wav",
  "/sounds/zen-bowl.wav",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Handle messages from the main app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SCHEDULE_NOTIFICATION") {
    const { endAt, phase, locale } = event.data;
    scheduleNotification(endAt, phase, locale);
  }
  if (event.data && event.data.type === "CANCEL_NOTIFICATION") {
    cancelScheduledNotification();
  }
});

// Store timeout ID for scheduled notifications
let scheduledTimeout = null;

function scheduleNotification(endAt, phase, locale) {
  // Cancel any existing scheduled notification
  cancelScheduledNotification();

  const now = Date.now();
  const delay = endAt - now;

  if (delay <= 0) return;

  scheduledTimeout = setTimeout(() => {
    showTimerNotification(phase, locale);
  }, delay);
}

function cancelScheduledNotification() {
  if (scheduledTimeout) {
    clearTimeout(scheduledTimeout);
    scheduledTimeout = null;
  }
}

function showTimerNotification(phase, locale) {
  const messages = {
    uz: {
      focusComplete: "Fokus vaqti tugadi!",
      focusBody: "Dam olish vaqti keldi. Tanaffus boshlandi.",
      timeoutComplete: "Tanaffus tugadi!",
      timeoutBody: "Yangi fokus sessiyasiga tayyormisiz?",
    },
    ru: {
      focusComplete: "Время фокуса закончилось!",
      focusBody: "Пора отдохнуть. Перерыв начался.",
      timeoutComplete: "Перерыв закончился!",
      timeoutBody: "Готовы к новой сессии фокуса?",
    },
    en: {
      focusComplete: "Focus time is up!",
      focusBody: "Time for a break. Timeout has started.",
      timeoutComplete: "Timeout is over!",
      timeoutBody: "Ready for a new focus session?",
    },
  };

  const t = messages[locale] || messages.en;

  const title = phase === "focus" ? t.focusComplete : t.timeoutComplete;
  const body = phase === "focus" ? t.focusBody : t.timeoutBody;

  self.registration.showNotification(title, {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: "focus-timeout-timer",
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
  });
}

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If there's already a window open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(event.request)
            .then((cached) => cached || caches.match("/offline.html"))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
