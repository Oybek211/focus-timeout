"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Stats, DailyStats, defaultStats } from "@/lib/storage";

type StatsStore = {
  stats: Stats;
  recordSession: (focusMinutes: number, timeoutMinutes: number) => void;
};

function getDateKey(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

export const useStatsStore = create<StatsStore>()(
  persist(
    (set) => ({
      stats: defaultStats,
      recordSession: (focusMinutes, timeoutMinutes) =>
        set((state) => {
          const dateKey = getDateKey();
          const daily: DailyStats = state.stats.daily[dateKey] ?? {
            focusMinutes: 0,
            timeoutMinutes: 0,
            sessions: 0,
          };
          return {
            stats: {
              totalFocusMinutes: state.stats.totalFocusMinutes + focusMinutes,
              totalTimeoutMinutes:
                state.stats.totalTimeoutMinutes + timeoutMinutes,
              completedSessions: state.stats.completedSessions + 1,
              daily: {
                ...state.stats.daily,
                [dateKey]: {
                  focusMinutes: daily.focusMinutes + focusMinutes,
                  timeoutMinutes: daily.timeoutMinutes + timeoutMinutes,
                  sessions: daily.sessions + 1,
                },
              },
            },
          };
        }),
    }),
    {
      name: "focus-timeout:stats",
      merge: (persisted, current) => {
        const stored = persisted as Partial<StatsStore> | undefined;
        if (!stored?.stats) return current;
        return {
          ...current,
          stats: {
            ...defaultStats,
            ...stored.stats,
            daily: stored.stats.daily ?? {},
          },
        };
      },
    }
  )
);

export function useStats(): Stats {
  return useStatsStore((state) => state.stats);
}

export function useRecordSession() {
  return useStatsStore((state) => state.recordSession);
}
