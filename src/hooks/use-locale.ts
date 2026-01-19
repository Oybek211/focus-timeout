"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale, translations, Translations } from "@/lib/i18n";

type LocaleStore = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: "uz",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "focus-timeout:locale",
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

export function useLocale() {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const hydrated = useHydration();

  return {
    locale: hydrated ? locale : "uz",
    setLocale,
    isHydrated: hydrated,
  };
}

export function useTranslations(): Translations {
  const { locale } = useLocale();
  return translations[locale];
}
