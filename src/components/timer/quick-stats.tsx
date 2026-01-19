"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStats } from "@/hooks/use-stats";

export default function QuickStats() {
  const stats = useStats();

  const todayKey = useMemo(() => {
    const now = new Date();
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
  }, []);

  const today = stats.daily[todayKey] ?? {
    focusMinutes: 0,
    timeoutMinutes: 0,
    sessions: 0,
  };

  return (
    <Card className="border-border bg-card/80 backdrop-blur-sm">
      <CardHeader className="px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
        <CardTitle className="text-base">Today</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 px-4 pb-4 sm:gap-4 sm:px-6 sm:pb-6">
        <div className="rounded-xl border border-border bg-muted/50 p-3 sm:rounded-2xl sm:p-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
            Focus
          </p>
          <div className="mt-1.5 text-2xl font-semibold text-foreground sm:mt-2 sm:text-3xl">
            {today.focusMinutes} min
          </div>
        </div>
        <div className="rounded-xl border border-border bg-muted/50 p-3 sm:rounded-2xl sm:p-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
            Timeout
          </p>
          <div className="mt-1.5 text-2xl font-semibold text-foreground sm:mt-2 sm:text-3xl">
            {today.timeoutMinutes} min
          </div>
        </div>
        <div className="rounded-xl border border-border bg-muted/50 p-3 sm:rounded-2xl sm:p-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
            Sessions
          </p>
          <div className="mt-1.5 text-2xl font-semibold text-foreground sm:mt-2 sm:text-3xl">
            {today.sessions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
