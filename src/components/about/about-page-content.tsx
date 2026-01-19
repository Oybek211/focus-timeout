"use client";

import { Timer, Wifi, WifiOff, Globe, BarChart3, Bell, Repeat } from "lucide-react";
import { useTranslations } from "@/hooks/use-locale";

export default function AboutPageContent() {
  const t = useTranslations();

  const features = [
    { icon: Timer, text: t.aboutPage.feature1 },
    { icon: Repeat, text: t.aboutPage.feature2 },
    { icon: Bell, text: t.aboutPage.feature3 },
    { icon: BarChart3, text: t.aboutPage.feature4 },
    { icon: WifiOff, text: t.aboutPage.feature5 },
    { icon: Globe, text: t.aboutPage.feature6 },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">{t.aboutPage.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t.aboutPage.description}
        </p>
      </div>

      <div className="grid gap-6">
        {/* What is Focus Timeout */}
        <div className="rounded-3xl border border-border bg-card/80 p-6">
          <h2 className="text-lg font-semibold text-foreground">{t.aboutPage.whatIs}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.aboutPage.whatIsAnswer}</p>
        </div>

        {/* Features */}
        <div className="rounded-3xl border border-border bg-card/80 p-6">
          <h2 className="text-lg font-semibold text-foreground">{t.aboutPage.features}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-3xl border border-border bg-card/80 p-6">
          <h2 className="text-lg font-semibold text-foreground">{t.aboutPage.howItWorks}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.aboutPage.howItWorksAnswer}</p>
        </div>

        {/* Offline mode */}
        <div className="rounded-3xl border border-border bg-card/80 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Wifi className="h-5 w-5 text-emerald-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t.aboutPage.offline}</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t.aboutPage.offlineAnswer}</p>
        </div>
      </div>
    </div>
  );
}
