export type SoundSettings = {
  focusStart: string;
  focusEnd: string;
  timeoutStart: string;
  timeoutEnd: string;
};

export type TimeoutMode = "percent" | "fixed";
export type RepeatMode = "once" | "loop" | "custom";

export type Settings = {
  focusSeconds: number;
  timeoutMode: TimeoutMode;
  timeoutPercent: number;
  timeoutSeconds: number;
  repeatMode: RepeatMode;
  repeatCount: number;
  sounds: SoundSettings;
  customSounds: Record<string, string>; // name -> base64 data URL
};

export type DailyStats = {
  focusMinutes: number;
  timeoutMinutes: number;
  sessions: number;
};

export type Stats = {
  totalFocusMinutes: number;
  totalTimeoutMinutes: number;
  completedSessions: number;
  daily: Record<string, DailyStats>;
};

export const defaultSettings: Settings = {
  focusSeconds: 25 * 60,
  timeoutMode: "fixed",
  timeoutPercent: 10,
  timeoutSeconds: 5 * 60,
  repeatMode: "loop",
  repeatCount: 2,
  sounds: {
    focusStart: "/sounds/focus-start.wav",
    focusEnd: "/sounds/focus-end.wav",
    timeoutStart: "/sounds/timeout-start.wav",
    timeoutEnd: "/sounds/timeout-end.wav",
  },
  customSounds: {},
};

export const defaultStats: Stats = {
  totalFocusMinutes: 0,
  totalTimeoutMinutes: 0,
  completedSessions: 0,
  daily: {},
};
