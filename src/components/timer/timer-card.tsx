"use client";

import { useEffect, useMemo, useRef, useState, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { Settings, Play, Pause, RotateCcw, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import WheelPicker from "@/components/ui/wheel-picker";
import { useSettings } from "@/hooks/use-settings";
import { useRecordSession } from "@/hooks/use-stats";
import { useTranslations, useLocale } from "@/hooks/use-locale";
import { useNotifications } from "@/hooks/use-notifications";
import { useTimerStore } from "@/hooks/use-timer";
import { formatDuration } from "@/lib/time";
import { cn } from "@/lib/utils";
import { RepeatMode } from "@/lib/storage";
import CircularProgress from "./circular-progress";

type PickerType = "focus" | "timeout" | null;

const HOUR_VALUES = Array.from({ length: 4 }, (_, i) => i);
const MINUTE_VALUES = Array.from({ length: 60 }, (_, i) => i);
const SECOND_VALUES = Array.from({ length: 60 }, (_, i) => i);

// Hydration-safe hook using useSyncExternalStore
const emptySubscribe = () => () => {};
function useHydration() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function TimerCard() {
  const t = useTranslations();
  const { locale } = useLocale();
  const { settings, updateSettings } = useSettings();
  const recordSession = useRecordSession();
  const hydrated = useHydration();
  const { permission, isSupported, requestPermission, scheduleNotification, cancelNotification } = useNotifications();

  // Get timer state from persistent store
  const timerStore = useTimerStore();
  const {
    phase,
    status,
    currentSession,
    endAt,
    pausedRemainingMs,
    phaseDurationMs,
    startTimer: storeStartTimer,
    pauseTimer: storePauseTimer,
    resumeTimer: storeResumeTimer,
    resetTimer: storeResetTimer,
    transitionToTimeout,
    transitionToNextSession,
    completeTimer,
  } = timerStore;

  const [pickerOpen, setPickerOpen] = useState<PickerType>(null);
  const [tempHours, setTempHours] = useState(0);
  const [tempMinutes, setTempMinutes] = useState(0);
  const [tempSeconds, setTempSeconds] = useState(0);
  const [, forceUpdate] = useState(0);
  const audioMapRef = useRef<Record<string, HTMLAudioElement>>({});
  const processedEndRef = useRef<number | null>(null);

  const focusMs = useMemo(
    () => settings.focusSeconds * 1000,
    [settings.focusSeconds]
  );

  const timeoutSeconds = useMemo(() => {
    if (settings.timeoutMode === "fixed") {
      return settings.timeoutSeconds;
    }
    return Math.round((settings.focusSeconds * settings.timeoutPercent) / 100);
  }, [
    settings.focusSeconds,
    settings.timeoutPercent,
    settings.timeoutSeconds,
    settings.timeoutMode,
  ]);

  const timeoutMs = useMemo(() => timeoutSeconds * 1000, [timeoutSeconds]);

  const totalSessions = useMemo(() => {
    if (settings.repeatMode === "once") return 1;
    if (settings.repeatMode === "loop") return Infinity;
    return settings.repeatCount;
  }, [settings.repeatMode, settings.repeatCount]);

  const { focusStart, focusEnd, timeoutStart, timeoutEnd } = settings.sounds;

  // Preload audio files
  useEffect(() => {
    const urls = [focusStart, focusEnd, timeoutStart, timeoutEnd].filter(Boolean);
    const nextMap: Record<string, HTMLAudioElement> = {};
    urls.forEach((url) => {
      if (!url) return;
      const audio = new Audio(url);
      audio.preload = "auto";
      nextMap[url] = audio;
    });
    audioMapRef.current = nextMap;
  }, [focusStart, focusEnd, timeoutStart, timeoutEnd]);

  const playSound = useCallback((url: string) => {
    if (!url) return;
    const audio = audioMapRef.current[url];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => undefined);
  }, []);

  // Compute display values directly (not in state to avoid setState-in-effect issues)
  const getDisplayValues = useCallback(() => {
    if (status === "idle") {
      return { displayMs: focusMs, progress: 0 };
    }

    if (status === "paused" && pausedRemainingMs !== null) {
      const prog = phaseDurationMs > 0 ? 1 - pausedRemainingMs / phaseDurationMs : 0;
      return { displayMs: pausedRemainingMs, progress: prog };
    }

    if (status === "running" && endAt) {
      const remaining = Math.max(0, endAt - Date.now());
      const prog = phaseDurationMs > 0 ? 1 - remaining / phaseDurationMs : 0;
      return { displayMs: remaining, progress: prog };
    }

    if (status === "complete") {
      return { displayMs: 0, progress: 1 };
    }

    return { displayMs: focusMs, progress: 0 };
  }, [status, pausedRemainingMs, endAt, phaseDurationMs, focusMs]);

  // Get current display values (will be recalculated on each render triggered by forceUpdate)
  const { displayMs, progress } = getDisplayValues();

  // Main timer loop - triggers re-renders and handles transitions
  useEffect(() => {
    if (!hydrated) return;
    if (status !== "running") return;

    const interval = window.setInterval(() => {
      if (!endAt) return;

      const now = Date.now();
      const remaining = Math.max(0, endAt - now);

      // Trigger re-render to update display values
      forceUpdate((n) => n + 1);

      // Handle phase transitions when time runs out
      if (remaining === 0 && processedEndRef.current !== endAt) {
        processedEndRef.current = endAt;

        if (phase === "focus") {
          playSound(settings.sounds.focusEnd);
          transitionToTimeout(timeoutMs);
          playSound(settings.sounds.timeoutStart);
          // Schedule notification for timeout end
          scheduleNotification(Date.now() + timeoutMs, "timeout", locale);
        } else {
          playSound(settings.sounds.timeoutEnd);
          recordSession(
            Math.round(settings.focusSeconds / 60),
            Math.round(timeoutSeconds / 60)
          );

          if (currentSession < totalSessions) {
            transitionToNextSession(focusMs, totalSessions);
            playSound(settings.sounds.focusStart);
            // Schedule notification for next focus end
            scheduleNotification(Date.now() + focusMs, "focus", locale);
          } else {
            completeTimer();
            cancelNotification();
          }
        }
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [
    hydrated,
    phase,
    status,
    endAt,
    settings.sounds.focusEnd,
    settings.sounds.focusStart,
    settings.sounds.timeoutEnd,
    settings.sounds.timeoutStart,
    settings.focusSeconds,
    focusMs,
    timeoutMs,
    timeoutSeconds,
    recordSession,
    currentSession,
    totalSessions,
    playSound,
    transitionToTimeout,
    transitionToNextSession,
    completeTimer,
    scheduleNotification,
    cancelNotification,
    locale,
  ]);

  const startTimer = async () => {
    // Request notification permission if not granted
    if (isSupported && permission === "default") {
      await requestPermission();
    }

    storeStartTimer(focusMs);
    processedEndRef.current = null;
    playSound(settings.sounds.focusStart);

    // Schedule notification for when focus ends
    const newEndAt = Date.now() + focusMs;
    scheduleNotification(newEndAt, "focus", locale);
  };

  const pauseTimer = () => {
    storePauseTimer();
    cancelNotification();
  };

  const resumeTimer = () => {
    storeResumeTimer();
    // Re-schedule notification with new end time
    if (pausedRemainingMs !== null) {
      const newEndAt = Date.now() + pausedRemainingMs;
      scheduleNotification(newEndAt, phase, locale);
    }
  };

  const resetTimer = () => {
    storeResetTimer();
    processedEndRef.current = null;
    cancelNotification();
  };

  const openFocusPicker = () => {
    const hours = Math.floor(settings.focusSeconds / 3600);
    const minutes = Math.floor((settings.focusSeconds % 3600) / 60);
    const seconds = settings.focusSeconds % 60;
    setTempHours(hours);
    setTempMinutes(minutes);
    setTempSeconds(seconds);
    setPickerOpen("focus");
  };

  const openTimeoutPicker = () => {
    const hours = Math.floor(timeoutSeconds / 3600);
    const minutes = Math.floor((timeoutSeconds % 3600) / 60);
    const seconds = timeoutSeconds % 60;
    setTempHours(hours);
    setTempMinutes(minutes);
    setTempSeconds(seconds);
    setPickerOpen("timeout");
  };

  const handlePickerConfirm = () => {
    const totalSecs = tempHours * 3600 + tempMinutes * 60 + tempSeconds;
    if (pickerOpen === "focus") {
      updateSettings({
        ...settings,
        focusSeconds: Math.max(1, totalSecs),
      });
    } else if (pickerOpen === "timeout") {
      updateSettings({
        ...settings,
        timeoutMode: "fixed",
        timeoutSeconds: Math.max(1, totalSecs),
      });
    }
    setPickerOpen(null);
  };

  const formatTimeDisplay = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
      return s > 0 ? `${h}h ${m}m ${s}s` : `${h}h ${m}m`;
    }
    if (m > 0) {
      return s > 0 ? `${m}m ${s}s` : `${m} min`;
    }
    return `${s}s`;
  };

  // Show loading state until hydrated
  if (!hydrated) {
    return (
      <Card className="border-border bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-col gap-3 px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg">{t.timer.focusSession}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 px-4 pb-4 sm:gap-6 sm:px-6 sm:pb-6">
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="h-[220px] sm:h-[260px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const shownDisplayMs = status === "idle" ? focusMs : displayMs;

  return (
    <>
      <Card className="border-border bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-col gap-3 px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg">{t.timer.focusSession}</CardTitle>
            <div className="flex items-center gap-2">
              {/* Notification permission indicator */}
              {isSupported && (
                <button
                  onClick={permission !== "granted" ? requestPermission : undefined}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full transition-colors sm:h-8 sm:w-8",
                    permission === "granted"
                      ? "bg-emerald-500/15 text-emerald-500"
                      : permission === "denied"
                        ? "bg-red-500/15 text-red-500"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                  title={
                    permission === "granted"
                      ? t.timer.notificationsEnabled
                      : permission === "denied"
                        ? t.timer.notificationsDenied
                        : t.timer.enableNotifications
                  }
                >
                  {permission === "granted" ? (
                    <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    <BellOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                </button>
              )}
              {totalSessions > 1 && status !== "idle" && (
                <span className="text-xs text-muted-foreground">
                  {currentSession}/{totalSessions === Infinity ? "∞" : totalSessions}
                </span>
              )}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] sm:px-3 sm:py-1 sm:text-xs sm:tracking-[0.2em]",
                  phase === "focus"
                    ? "bg-cyan-500/15 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-200"
                    : "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-200"
                )}
              >
                {phase === "focus" ? t.timer.focus : t.timer.timeout}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 px-4 pb-4 sm:gap-6 sm:px-6 sm:pb-6">
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <CircularProgress
              progress={progress}
              size={220}
              strokeWidth={8}
              className="sm:hidden"
              progressClassName={
                phase === "focus" ? "stroke-cyan-400" : "stroke-emerald-400"
              }
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-mono text-4xl font-semibold text-foreground">
                  {formatDuration(shownDisplayMs)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {phase === "focus"
                    ? `${formatTimeDisplay(settings.focusSeconds)} ${t.timer.focus.toLowerCase()}`
                    : `${formatTimeDisplay(timeoutSeconds)} ${t.timer.timeout.toLowerCase()}`}
                </span>
              </div>
            </CircularProgress>
            <CircularProgress
              progress={progress}
              size={260}
              strokeWidth={10}
              className="hidden sm:block"
              progressClassName={
                phase === "focus" ? "stroke-cyan-400" : "stroke-emerald-400"
              }
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-5xl font-semibold text-foreground sm:text-6xl">
                  {formatDuration(shownDisplayMs)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {phase === "focus"
                    ? `${formatTimeDisplay(settings.focusSeconds)} ${t.timer.focus.toLowerCase()}`
                    : `${formatTimeDisplay(timeoutSeconds)} ${t.timer.timeout.toLowerCase()}`}
                </span>
              </div>
            </CircularProgress>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {status === "idle" || status === "complete" ? (
                <Button size="lg" onClick={startTimer} className="h-10 gap-2 px-6 sm:h-11 sm:px-8">
                  <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t.timer.start}
                </Button>
              ) : null}
              {status === "running" ? (
                <Button size="lg" variant="secondary" onClick={pauseTimer} className="h-10 gap-2 px-6 sm:h-11 sm:px-8">
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t.timer.pause}
                </Button>
              ) : null}
              {status === "paused" ? (
                <Button size="lg" onClick={resumeTimer} className="h-10 gap-2 px-6 sm:h-11 sm:px-8">
                  <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t.timer.resume}
                </Button>
              ) : null}
              {status !== "idle" && (
                <Button variant="ghost" size="icon" onClick={resetTimer} className="h-10 w-10 sm:h-11 sm:w-11">
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              )}
            </div>

            {status === "complete" && (
              <p className="text-center text-xs text-cyan-600 dark:text-cyan-200 sm:text-sm">
                {totalSessions > 1
                  ? t.timer.allSessionsComplete.replace("{count}", String(totalSessions))
                  : t.timer.sessionComplete}
              </p>
            )}
          </div>

          {/* Quick Settings */}
          <div className="grid gap-3 rounded-lg border border-border bg-muted/50 p-3 sm:gap-4 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">{t.timer.quickSettings}</span>
              <Button variant="ghost" size="sm" asChild className="h-7 px-2 sm:h-8 sm:px-3">
                <Link href="/settings" className="gap-1 text-[10px] sm:text-xs">
                  <Settings className="h-3 w-3" />
                  {t.timer.allSettings}
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="grid gap-1.5 sm:gap-2">
                <Label className="text-[10px] text-muted-foreground sm:text-xs">{t.timer.focus}</Label>
                <button
                  onClick={openFocusPicker}
                  disabled={status === "running"}
                  className="flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:h-9"
                >
                  {formatTimeDisplay(settings.focusSeconds)}
                </button>
              </div>

              <div className="grid gap-1.5 sm:gap-2">
                <Label className="text-[10px] text-muted-foreground sm:text-xs">{t.timer.timeout}</Label>
                <button
                  onClick={openTimeoutPicker}
                  disabled={status === "running"}
                  className="flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:h-9"
                >
                  {formatTimeDisplay(timeoutSeconds)}
                </button>
              </div>

              <div className="grid gap-1.5 sm:gap-2">
                <Label className="text-[10px] text-muted-foreground sm:text-xs">{t.timer.repeat}</Label>
                <div className="flex gap-1 sm:gap-2">
                  <Select
                    value={settings.repeatMode}
                    onValueChange={(value: RepeatMode) =>
                      updateSettings({ ...settings, repeatMode: value })
                    }
                    disabled={status === "running"}
                  >
                    <SelectTrigger className="h-8 flex-1 text-xs sm:h-9 sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">{t.timer.once}</SelectItem>
                      <SelectItem value="loop">{t.timer.loop}</SelectItem>
                      <SelectItem value="custom">{t.timer.custom}</SelectItem>
                    </SelectContent>
                  </Select>
                  {settings.repeatMode === "custom" && (
                    <Input
                      type="number"
                      min={2}
                      max={10}
                      value={settings.repeatCount}
                      onChange={(e) =>
                        updateSettings({
                          ...settings,
                          repeatCount: Math.max(2, Math.min(10, Number(e.target.value) || 2)),
                        })
                      }
                      className="h-8 w-12 text-sm sm:h-9 sm:w-16"
                      disabled={status === "running"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Picker Modal */}
      <Modal
        open={pickerOpen !== null}
        onClose={() => setPickerOpen(null)}
        title={pickerOpen === "focus" ? t.timePicker.setFocusTime : t.timePicker.setTimeout}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-1">
            <WheelPicker
              values={HOUR_VALUES}
              value={tempHours}
              onChange={setTempHours}
              label={t.timePicker.hours}
              min={0}
              max={3}
            />
            <span className="mb-6 text-2xl font-medium text-muted-foreground">:</span>
            <WheelPicker
              values={MINUTE_VALUES}
              value={tempMinutes}
              onChange={setTempMinutes}
              label={t.timePicker.min}
              min={0}
              max={59}
            />
            <span className="mb-6 text-2xl font-medium text-muted-foreground">:</span>
            <WheelPicker
              values={SECOND_VALUES}
              value={tempSeconds}
              onChange={setTempSeconds}
              label={t.timePicker.sec}
              min={0}
              max={59}
            />
          </div>

          <div className="flex w-full gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setPickerOpen(null)}
            >
              {t.timePicker.cancel}
            </Button>
            <Button
              className="flex-1"
              onClick={handlePickerConfirm}
            >
              {t.timePicker.confirm}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
