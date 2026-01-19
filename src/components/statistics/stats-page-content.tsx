"use client";

import { useTranslations } from "@/hooks/use-locale";
import StatsPanel from "@/components/statistics/stats-panel";

export default function StatsPageContent() {
  const t = useTranslations();

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">{t.statsPage.title}</h1>
        <p className="text-sm text-white/60">
          {t.statsPage.description}
        </p>
      </div>
      <StatsPanel />
    </div>
  );
}
