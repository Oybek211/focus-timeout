"use client";

import { useTranslations } from "@/hooks/use-locale";

export default function HelpPageContent() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">{t.helpPage.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t.helpPage.description}
        </p>
      </div>
      <div className="grid gap-4 rounded-3xl border border-border bg-card/80 p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t.helpPage.howToUse}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t.helpPage.howToUseAnswer}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t.helpPage.repeatOptions}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t.helpPage.repeatOptionsAnswer}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t.helpPage.timerAccuracy}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t.helpPage.timerAccuracyAnswer}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t.helpPage.dataSync}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t.helpPage.dataSyncAnswer}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t.helpPage.howToInstall}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t.helpPage.howToInstallAnswer}
          </p>
        </div>
      </div>
    </div>
  );
}
