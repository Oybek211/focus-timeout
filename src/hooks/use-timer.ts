"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Phase = "focus" | "timeout";
type Status = "idle" | "running" | "paused" | "complete";

type TimerState = {
  phase: Phase;
  status: Status;
  currentSession: number;
  // Store the target end time (timestamp) instead of remaining time
  endAt: number | null;
  // Store paused remaining ms when paused
  pausedRemainingMs: number | null;
  // Store when the timer was started for this phase
  phaseStartedAt: number | null;
  // Store the duration for current phase in ms
  phaseDurationMs: number;
  // Track if we need to show completion notification
  pendingCompletion: boolean;
};

type TimerActions = {
  startTimer: (focusMs: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  transitionToTimeout: (timeoutMs: number) => void;
  transitionToNextSession: (focusMs: number, totalSessions: number) => void;
  completeTimer: () => void;
  clearPendingCompletion: () => void;
  getRemainingMs: () => number;
};

const initialState: TimerState = {
  phase: "focus",
  status: "idle",
  currentSession: 1,
  endAt: null,
  pausedRemainingMs: null,
  phaseStartedAt: null,
  phaseDurationMs: 0,
  pendingCompletion: false,
};

export const useTimerStore = create<TimerState & TimerActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      startTimer: (focusMs: number) => {
        const now = Date.now();
        set({
          phase: "focus",
          status: "running",
          currentSession: 1,
          endAt: now + focusMs,
          pausedRemainingMs: null,
          phaseStartedAt: now,
          phaseDurationMs: focusMs,
          pendingCompletion: false,
        });
      },

      pauseTimer: () => {
        const { endAt, status } = get();
        if (status !== "running" || !endAt) return;

        const remaining = Math.max(0, endAt - Date.now());
        set({
          status: "paused",
          endAt: null,
          pausedRemainingMs: remaining,
        });
      },

      resumeTimer: () => {
        const { pausedRemainingMs, status } = get();
        if (status !== "paused" || pausedRemainingMs === null) return;

        set({
          status: "running",
          endAt: Date.now() + pausedRemainingMs,
          pausedRemainingMs: null,
        });
      },

      resetTimer: () => {
        set(initialState);
      },

      transitionToTimeout: (timeoutMs: number) => {
        const now = Date.now();
        set({
          phase: "timeout",
          endAt: now + timeoutMs,
          phaseStartedAt: now,
          phaseDurationMs: timeoutMs,
        });
      },

      transitionToNextSession: (focusMs: number, totalSessions: number) => {
        const { currentSession } = get();
        if (currentSession < totalSessions) {
          const now = Date.now();
          set({
            currentSession: currentSession + 1,
            phase: "focus",
            endAt: now + focusMs,
            phaseStartedAt: now,
            phaseDurationMs: focusMs,
          });
        } else {
          set({
            status: "complete",
            endAt: null,
            pendingCompletion: false,
          });
        }
      },

      completeTimer: () => {
        set({
          status: "complete",
          endAt: null,
          pendingCompletion: false,
        });
      },

      clearPendingCompletion: () => {
        set({ pendingCompletion: false });
      },

      getRemainingMs: () => {
        const { status, endAt, pausedRemainingMs } = get();
        if (status === "paused" && pausedRemainingMs !== null) {
          return pausedRemainingMs;
        }
        if (status === "running" && endAt) {
          return Math.max(0, endAt - Date.now());
        }
        return 0;
      },
    }),
    {
      name: "focus-timeout:timer",
      // Only persist certain fields
      partialize: (state) => ({
        phase: state.phase,
        status: state.status,
        currentSession: state.currentSession,
        endAt: state.endAt,
        pausedRemainingMs: state.pausedRemainingMs,
        phaseStartedAt: state.phaseStartedAt,
        phaseDurationMs: state.phaseDurationMs,
        pendingCompletion: state.pendingCompletion,
      }),
    }
  )
);
