"use client";

import { useTranslations } from "@/hooks/use-locale";
import SettingsForm from "@/components/settings/settings-form";

export default function SettingsPageContent() {
  const t = useTranslations();

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">{t.settingsPage.title}</h1>
        <p className="text-sm text-white/60">
          {t.settingsPage.description}
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
