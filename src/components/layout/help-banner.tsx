"use client";

import { useState, useSyncExternalStore, useCallback } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useTranslations } from "@/hooks/use-locale";

const DISMISSED_KEY = "focus-timeout:help-banner-dismissed";

// Hydration-safe hook
const emptySubscribe = () => () => {};
function useHydration() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function HelpBanner() {
  const t = useTranslations();
  const hydrated = useHydration();
  const [dismissedState, setDismissedState] = useState(false);

  // Read from localStorage only after hydration
  const isDismissed = useCallback(() => {
    if (!hydrated) return true; // Hide during SSR
    if (dismissedState) return true;
    const stored = localStorage.getItem(DISMISSED_KEY);
    return stored === "true";
  }, [hydrated, dismissedState]);

  if (isDismissed()) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissedState(true);
  };

  return (
    <div className="border-b border-white/5 bg-primary/10 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2 sm:px-6 lg:px-10">
        <Link
          href="/help"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.helpBanner.newTo} <span className="font-medium text-foreground">Focus Timeout</span>? {t.helpBanner.learnHow} →
        </Link>
        <button
          onClick={handleDismiss}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
