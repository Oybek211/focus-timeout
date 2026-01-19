"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stats } from "@/lib/storage";
import { useStats } from "@/hooks/use-stats";
import { useTranslations } from "@/hooks/use-locale";

function parseDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diff = (day + 6) % 7;
  const start = new Date(now);
  start.setDate(now.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end };
}

function aggregate(stats: Stats, keys: string[]) {
  return keys.reduce(
    (acc, key) => {
      const entry = stats.daily[key];
      if (!entry) return acc;
      return {
        focusMinutes: acc.focusMinutes + entry.focusMinutes,
        timeoutMinutes: acc.timeoutMinutes + entry.timeoutMinutes,
        sessions: acc.sessions + entry.sessions,
      };
    },
    { focusMinutes: 0, timeoutMinutes: 0, sessions: 0 }
  );
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

export default function StatsPanel() {
  const stats = useStats();
  const t = useTranslations();

  const todayKey = useMemo(() => {
    const now = new Date();
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
  }, []);

  const today = useMemo(() => aggregate(stats, [todayKey]), [stats, todayKey]);

  const week = useMemo(() => {
    const { start, end } = getWeekRange();
    const keys = Object.keys(stats.daily).filter((key) => {
      const date = parseDateKey(key);
      return date >= start && date < end;
    });
    return aggregate(stats, keys);
  }, [stats]);

  const allTime = useMemo(
    () => ({
      focusMinutes: stats.totalFocusMinutes,
      timeoutMinutes: stats.totalTimeoutMinutes,
      sessions: stats.completedSessions,
    }),
    [stats]
  );

  const renderSummary = (data: {
    focusMinutes: number;
    timeoutMinutes: number;
    sessions: number;
  }) => (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t.statsPage.focusMinutes}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-white">
            {formatNumber(data.focusMinutes)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t.statsPage.timeoutMinutes}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-white">
            {formatNumber(data.timeoutMinutes)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t.statsPage.sessions}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-white">
            {formatNumber(data.sessions)}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Tabs defaultValue="today" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="today">{t.statsPage.today}</TabsTrigger>
        <TabsTrigger value="week">{t.statsPage.thisWeek}</TabsTrigger>
        <TabsTrigger value="all">{t.statsPage.allTime}</TabsTrigger>
      </TabsList>
      <TabsContent value="today" className="mt-6">
        {renderSummary(today)}
      </TabsContent>
      <TabsContent value="week" className="mt-6">
        {renderSummary(week)}
      </TabsContent>
      <TabsContent value="all" className="mt-6">
        {renderSummary(allTime)}
      </TabsContent>
    </Tabs>
  );
}
