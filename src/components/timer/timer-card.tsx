"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Settings, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/hooks/use-settings";
import { useRecordSession } from "@/hooks/use-stats";
import { formatDuration } from "@/lib/time";
import { cn } from "@/lib/utils";
import { RepeatMode } from "@/lib/storage";
import CircularProgress from "./circular-progress";

type Phase = "focus" | "timeout";
type Status = "idle" | "running" | "paused" | "complete";

export default function TimerCard() {
  const { settings, updateSettings } = useSettings();
  const recordSession = useRecordSession();
  const [phase, setPhase] = useState<Phase>("focus");
  const [status, setStatus] = useState<Status>("idle");
  const [currentSession, setCurrentSession] = useState(1);
  const [remainingMs, setRemainingMs] = useState(
    settings.focusMinutes * 60 * 1000
  );
  const endAtRef = useRef<number | null>(null);
  const audioMapRef = useRef<Record<string, HTMLAudioElement>>({});

  const focusMs = useMemo(
    () => settings.focusMinutes * 60 * 1000,
    [settings.focusMinutes]
  );

  const timeoutMinutes = useMemo(() => {
    if (settings.timeoutMode === "fixed") {
      return settings.timeoutMinutes;
    }
    return Number(
      ((settings.focusMinutes * settings.timeoutPercent) / 100).toFixed(1)
    );
  }, [
    settings.focusMinutes,
    settings.timeoutPercent,
    settings.timeoutMinutes,
    settings.timeoutMode,
  ]);

  const timeoutMs = useMemo(() => timeoutMinutes * 60 * 1000, [timeoutMinutes]);

  const totalSessions = useMemo(() => {
    if (settings.repeatMode === "once") return 1;
    if (settings.repeatMode === "loop") return Infinity;
    return settings.repeatCount;
  }, [settings.repeatMode, settings.repeatCount]);

  const { focusStart, focusEnd, timeoutStart, timeoutEnd } = settings.sounds;

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

  const playSound = (url: string) => {
    if (!url) return;
    const audio = audioMapRef.current[url];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => undefined);
  };

  useEffect(() => {
    if (status !== "running") return;

    const interval = window.setInterval(() => {
      const endAt = endAtRef.current;
      if (!endAt) return;
      const remaining = Math.max(0, endAt - Date.now());
      setRemainingMs(remaining);

      if (remaining === 0) {
        if (phase === "focus") {
          playSound(settings.sounds.focusEnd);
          setPhase("timeout");
          setRemainingMs(timeoutMs);
          endAtRef.current = Date.now() + timeoutMs;
          playSound(settings.sounds.timeoutStart);
        } else {
          playSound(settings.sounds.timeoutEnd);
          recordSession(settings.focusMinutes, timeoutMinutes);

          if (currentSession < totalSessions) {
            setCurrentSession((s) => s + 1);
            setPhase("focus");
            setRemainingMs(focusMs);
            endAtRef.current = Date.now() + focusMs;
            playSound(settings.sounds.focusStart);
          } else {
            setStatus("complete");
            endAtRef.current = null;
          }
        }
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [
    phase,
    status,
    settings.sounds.focusEnd,
    settings.sounds.focusStart,
    settings.sounds.timeoutEnd,
    settings.sounds.timeoutStart,
    settings.focusMinutes,
    focusMs,
    timeoutMs,
    timeoutMinutes,
    recordSession,
    currentSession,
    totalSessions,
  ]);

  const startTimer = () => {
    setPhase("focus");
    setStatus("running");
    setCurrentSession(1);
    setRemainingMs(focusMs);
    endAtRef.current = Date.now() + focusMs;
    playSound(settings.sounds.focusStart);
  };

  const pauseTimer = () => {
    if (status !== "running") return;
    const endAt = endAtRef.current;
    if (!endAt) return;
    setRemainingMs(Math.max(0, endAt - Date.now()));
    endAtRef.current = null;
    setStatus("paused");
  };

  const resumeTimer = () => {
    if (status !== "paused") return;
    endAtRef.current = Date.now() + remainingMs;
    setStatus("running");
  };

  const resetTimer = () => {
    setStatus("idle");
    setPhase("focus");
    setCurrentSession(1);
    setRemainingMs(focusMs);
    endAtRef.current = null;
  };

  const durationMs = phase === "focus" ? focusMs : timeoutMs;
  const displayMs = status === "idle" ? focusMs : remainingMs;
  const progress =
    status === "idle" || !durationMs ? 0 : 1 - remainingMs / durationMs;

  return (
    <Card className="border-border bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-3 px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">Focus Session</CardTitle>
          <div className="flex items-center gap-2">
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
              {phase === "focus" ? "Focus" : "Timeout"}
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
                {formatDuration(displayMs)}
              </span>
              <span className="text-xs text-muted-foreground">
                {phase === "focus"
                  ? `${settings.focusMinutes} min focus`
                  : `${timeoutMinutes} min timeout`}
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
                {formatDuration(displayMs)}
              </span>
              <span className="text-sm text-muted-foreground">
                {phase === "focus"
                  ? `${settings.focusMinutes} min focus`
                  : `${timeoutMinutes} min timeout`}
              </span>
            </div>
          </CircularProgress>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {status === "idle" || status === "complete" ? (
              <Button size="lg" onClick={startTimer} className="h-10 gap-2 px-6 sm:h-11 sm:px-8">
                <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                Start
              </Button>
            ) : null}
            {status === "running" ? (
              <Button size="lg" variant="secondary" onClick={pauseTimer} className="h-10 gap-2 px-6 sm:h-11 sm:px-8">
                <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                Pause
              </Button>
            ) : null}
            {status === "paused" ? (
              <Button size="lg" onClick={resumeTimer} className="h-10 gap-2 px-6 sm:h-11 sm:px-8">
                <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                Resume
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
                ? `All ${totalSessions} sessions complete!`
                : "Session complete. Ready for another round."}
            </p>
          )}
        </div>

        {/* Quick Settings */}
        <div className="grid gap-3 rounded-lg border border-border bg-muted/50 p-3 sm:gap-4 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground sm:text-sm">Quick Settings</span>
            <Button variant="ghost" size="sm" asChild className="h-7 px-2 sm:h-8 sm:px-3">
              <Link href="/settings" className="gap-1 text-[10px] sm:text-xs">
                <Settings className="h-3 w-3" />
                All settings
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="grid gap-1.5 sm:gap-2">
              <Label className="text-[10px] text-muted-foreground sm:text-xs">Focus (min)</Label>
              <Input
                type="number"
                min={1}
                max={180}
                value={settings.focusMinutes}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    focusMinutes: Math.max(1, Math.min(180, Number(e.target.value) || 1)),
                  })
                }
                className="h-8 text-sm sm:h-9"
                disabled={status === "running"}
              />
            </div>

            <div className="grid gap-1.5 sm:gap-2">
              <Label className="text-[10px] text-muted-foreground sm:text-xs">Timeout (min)</Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={timeoutMinutes}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(60, Number(e.target.value) || 1));
                  updateSettings({
                    ...settings,
                    timeoutMode: "fixed",
                    timeoutMinutes: value,
                  });
                }}
                className="h-8 text-sm sm:h-9"
                disabled={status === "running"}
              />
            </div>

            <div className="grid gap-1.5 sm:gap-2">
              <Label className="text-[10px] text-muted-foreground sm:text-xs">Repeat</Label>
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
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="loop">Loop</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
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
  );
}
