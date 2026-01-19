"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Settings, defaultSettings } from "@/lib/storage";

type SettingsStore = {
  settings: Settings;
  updateSettings: (next: Settings) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

type LegacySettings = {
  focusMinutes?: number;
  timeoutMinutes?: number;
  focusSeconds?: number;
  timeoutSeconds?: number;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (next) => set({ settings: next }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "focus-timeout:settings",
      merge: (persisted, current) => {
        const stored = persisted as Partial<SettingsStore & { settings: LegacySettings }> | undefined;
        if (!stored?.settings) return current;

        // Migrate from old focusMinutes/timeoutMinutes to focusSeconds/timeoutSeconds
        let focusSeconds = stored.settings.focusSeconds;
        let timeoutSeconds = stored.settings.timeoutSeconds;

        if (focusSeconds === undefined && stored.settings.focusMinutes !== undefined) {
          focusSeconds = stored.settings.focusMinutes * 60;
        }
        if (timeoutSeconds === undefined && stored.settings.timeoutMinutes !== undefined) {
          timeoutSeconds = stored.settings.timeoutMinutes * 60;
        }

        return {
          ...current,
          settings: {
            ...defaultSettings,
            ...stored.settings,
            focusSeconds: focusSeconds ?? defaultSettings.focusSeconds,
            timeoutSeconds: timeoutSeconds ?? defaultSettings.timeoutSeconds,
            sounds: {
              ...defaultSettings.sounds,
              ...(stored.settings.sounds ?? {}),
            },
            customSounds: {
              ...defaultSettings.customSounds,
              ...(stored.settings.customSounds ?? {}),
            },
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Hydration-safe hook using useSyncExternalStore
const emptySubscribe = () => () => {};
function useHydration() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function useSettings() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const storeHasHydrated = useSettingsStore((state) => state._hasHydrated);
  const hydrated = useHydration();

  return {
    settings: hydrated && storeHasHydrated ? settings : defaultSettings,
    updateSettings,
    isHydrated: hydrated && storeHasHydrated,
  };
}
