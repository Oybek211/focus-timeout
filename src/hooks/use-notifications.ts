"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

// Hydration-safe hook using useSyncExternalStore
const emptySubscribe = () => () => {};
function useHydration() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

type NotificationPermissionState = "default" | "granted" | "denied";

// Get current notification permission (hydration-safe)
function getNotificationPermission(hydrated: boolean): NotificationPermissionState {
  if (!hydrated) return "default";
  if (typeof Notification === "undefined") return "default";
  return Notification.permission;
}

export function useNotifications() {
  const hydrated = useHydration();
  // Use state only for forcing re-render after permission change
  const [permissionUpdate, setPermissionUpdate] = useState(0);

  // Compute permission directly (no effect needed)
  // permissionUpdate is used to trigger re-computation after requestPermission
  const permission = getNotificationPermission(hydrated);
  void permissionUpdate; // Silence unused warning - used to trigger re-render

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") {
      return "denied" as NotificationPermissionState;
    }

    try {
      const result = await Notification.requestPermission();
      // Force re-render to update permission value
      setPermissionUpdate((n) => n + 1);
      return result as NotificationPermissionState;
    } catch {
      return "denied" as NotificationPermissionState;
    }
  }, []);

  const scheduleNotification = useCallback(
    async (endAt: number, phase: "focus" | "timeout", locale: string) => {
      if (typeof navigator === "undefined" || !navigator.serviceWorker) return;
      if (permission !== "granted") return;

      try {
        const registration = await navigator.serviceWorker.ready;
        registration.active?.postMessage({
          type: "SCHEDULE_NOTIFICATION",
          endAt,
          phase,
          locale,
        });
      } catch (error) {
        console.error("Failed to schedule notification:", error);
      }
    },
    [permission]
  );

  const cancelNotification = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.serviceWorker) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({
        type: "CANCEL_NOTIFICATION",
      });
    } catch (error) {
      console.error("Failed to cancel notification:", error);
    }
  }, []);

  const isSupported =
    hydrated &&
    typeof Notification !== "undefined" &&
    typeof navigator !== "undefined" &&
    "serviceWorker" in navigator;

  return {
    permission,
    isSupported,
    requestPermission,
    scheduleNotification,
    cancelNotification,
  };
}
