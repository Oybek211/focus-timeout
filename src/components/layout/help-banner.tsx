"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const DISMISSED_KEY = "focus-timeout:help-banner-dismissed";

export default function HelpBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(DISMISSED_KEY);
    setDismissed(stored === "true");
  }, []);

  if (dismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  };

  return (
    <div className="border-b border-white/5 bg-primary/10 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2 sm:px-6 lg:px-10">
        <Link
          href="/help"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          New to <span className="font-medium text-foreground">Focus Timeout</span>? Learn how it works →
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
