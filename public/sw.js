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
let scheduledPhase = null;
let scheduledLocale = null;

function scheduleNotification(endAt, phase, locale) {
  // Cancel any existing scheduled notification
  cancelScheduledNotification();

  const now = Date.now();
  const delay = endAt - now;

  if (delay <= 0) return;

  scheduledPhase = phase;
  scheduledLocale = locale;

  scheduledTimeout = setTimeout(async () => {
    // Check if any app window is visible/focused
    const clientList = await clients.matchAll({ type: "window", includeUncontrolled: true });
    const hasVisibleClient = clientList.some(client =>
      client.url.includes(self.location.origin) && client.visibilityState === "visible"
    );

    // Only show notification if user is NOT on the site
    if (!hasVisibleClient) {
      showTimerNotification(phase, locale);
    }
  }, delay);
}

function cancelScheduledNotification() {
  if (scheduledTimeout) {
    clearTimeout(scheduledTimeout);
    scheduledTimeout = null;
    scheduledPhase = null;
    scheduledLocale = null;
  }
}

function showTimerNotification(phase, locale) {
  const messages = {
    uz: {
      focusComplete: "Fokus vaqti tugadi!",
      focusBody: "Dam olish vaqti keldi. Tanaffus boshlandi.",
      timeoutComplete: "Tanaffus tugadi!",
      timeoutBody: "Davom etasizmi?",
      continueAction: "Davom etish",
      stopAction: "To'xtatish",
    },
    ru: {
      focusComplete: "Время фокуса закончилось!",
      focusBody: "Пора отдохнуть. Перерыв начался.",
      timeoutComplete: "Перерыв закончился!",
      timeoutBody: "Продолжить?",
      continueAction: "Продолжить",
      stopAction: "Остановить",
    },
    en: {
      focusComplete: "Focus time is up!",
      focusBody: "Time for a break. Timeout has started.",
      timeoutComplete: "Timeout is over!",
      timeoutBody: "Continue?",
      continueAction: "Continue",
      stopAction: "Stop",
    },
  };

  const t = messages[locale] || messages.en;

  const title = phase === "focus" ? t.focusComplete : t.timeoutComplete;
  const body = phase === "focus" ? t.focusBody : t.timeoutBody;

  // For timeout end, add action buttons to ask if user wants to continue
  const actions = phase === "timeout" ? [
    { action: "continue", title: t.continueAction },
    { action: "stop", title: t.stopAction },
  ] : [];

  self.registration.showNotification(title, {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: "focus-timeout-timer",
    data: { phase, locale },
    renotify: true,
    requireInteraction: phase === "timeout", // Only require interaction for timeout end
    vibrate: [200, 100, 200],
    actions,
  });
}

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  const action = event.action;
  const phase = event.notification.data?.phase;

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (clientList) => {
      // Find existing window
      let appWindow = null;
      for (const client of clientList) {
        if (client.url.includes(self.location.origin)) {
          appWindow = client;
          break;
        }
      }

      // If timeout ended and user clicked continue or the notification itself
      if (phase === "timeout" && action !== "stop") {
        // Send message to continue the timer
        if (appWindow) {
          appWindow.postMessage({ type: "CONTINUE_TIMER" });
          return appWindow.focus();
        } else if (clients.openWindow) {
          // Open window with continue flag
          return clients.openWindow("/?continue=1");
        }
      } else if (action === "stop") {
        // User wants to stop - just open the app
        if (appWindow) {
          appWindow.postMessage({ type: "STOP_TIMER" });
          return appWindow.focus();
        } else if (clients.openWindow) {
          return clients.openWindow("/");
        }
      } else {
        // Focus start notification - just open the app
        if (appWindow) {
          return appWindow.focus();
        } else if (clients.openWindow) {
          return clients.openWindow("/");
        }
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
