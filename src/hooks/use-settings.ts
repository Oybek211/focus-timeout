"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Settings, defaultSettings } from "@/lib/storage";

type SettingsStore = {
  settings: Settings;
  updateSettings: (next: Settings) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
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
        const stored = persisted as Partial<SettingsStore> | undefined;
        if (!stored?.settings) return current;
        return {
          ...current,
          settings: {
            ...defaultSettings,
            ...stored.settings,
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

export function useSettings() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const storeHasHydrated = useSettingsStore((state) => state._hasHydrated);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    settings: isHydrated && storeHasHydrated ? settings : defaultSettings,
    updateSettings,
    isHydrated: isHydrated && storeHasHydrated,
  };
}
