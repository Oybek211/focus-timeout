"use client";

import { useRef, useMemo, useState } from "react";
import { Upload, Trash2, Play } from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import Modal from "@/components/ui/modal";
import WheelPicker from "@/components/ui/wheel-picker";
import { getSoundOptions, fileToBase64 } from "@/lib/sounds";
import { Settings, TimeoutMode, RepeatMode } from "@/lib/storage";
import { useSettings } from "@/hooks/use-settings";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/hooks/use-locale";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalizePercent = (value: number) => clamp(value || 10, 5, 100);
const normalizeRepeatCount = (value: number) => clamp(value || 2, 2, 10);

const HOUR_VALUES = Array.from({ length: 4 }, (_, i) => i);
const MINUTE_VALUES = Array.from({ length: 60 }, (_, i) => i);
const SECOND_VALUES = Array.from({ length: 60 }, (_, i) => i);

type PickerType = "focus" | "timeout" | null;

export default function SettingsForm() {
  const { settings, updateSettings } = useSettings();
  const t = useTranslations();
  const [draft, setDraft] = useState<Settings | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pickerOpen, setPickerOpen] = useState<PickerType>(null);
  const [tempHours, setTempHours] = useState(0);
  const [tempMinutes, setTempMinutes] = useState(0);
  const [tempSeconds, setTempSeconds] = useState(0);

  const current = isDirty && draft ? draft : settings;
  const soundOptions = useMemo(
    () => getSoundOptions(current.customSounds),
    [current.customSounds]
  );

  const focusSeconds = current.focusSeconds;
  const timeoutPercent = normalizePercent(Number(current.timeoutPercent));
  const timeoutSecondsFixed = current.timeoutSeconds;

  const calculatedTimeoutSeconds = useMemo(
    () =>
      current.timeoutMode === "percent"
        ? Math.round((focusSeconds * timeoutPercent) / 100)
        : timeoutSecondsFixed,
    [focusSeconds, timeoutPercent, timeoutSecondsFixed, current.timeoutMode]
  );

  const updateDraft = (next: Partial<Settings>) => {
    const base = isDirty && draft ? draft : settings;
    setDraft({ ...base, ...next });
    setIsDirty(true);
  };

  const handleSave = () => {
    updateSettings({
      ...current,
      timeoutPercent,
    });
    setIsDirty(false);
    setDraft(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = file.name.replace(/\.[^/.]+$/, "");
    const base64 = await fileToBase64(file);

    updateDraft({
      customSounds: {
        ...current.customSounds,
        [name]: base64,
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeCustomSound = (name: string) => {
    const { [name]: _removed, ...rest } = current.customSounds;
    void _removed;
    updateDraft({ customSounds: rest });
  };

  const playPreview = (url: string) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch(() => undefined);
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

  const openFocusPicker = () => {
    const hours = Math.floor(focusSeconds / 3600);
    const minutes = Math.floor((focusSeconds % 3600) / 60);
    const seconds = focusSeconds % 60;
    setTempHours(hours);
    setTempMinutes(minutes);
    setTempSeconds(seconds);
    setPickerOpen("focus");
  };

  const openTimeoutPicker = () => {
    const hours = Math.floor(timeoutSecondsFixed / 3600);
    const minutes = Math.floor((timeoutSecondsFixed % 3600) / 60);
    const seconds = timeoutSecondsFixed % 60;
    setTempHours(hours);
    setTempMinutes(minutes);
    setTempSeconds(seconds);
    setPickerOpen("timeout");
  };

  const handlePickerConfirm = () => {
    const totalSecs = tempHours * 3600 + tempMinutes * 60 + tempSeconds;
    if (pickerOpen === "focus") {
      updateDraft({
        focusSeconds: Math.max(1, totalSecs),
      });
    } else if (pickerOpen === "timeout") {
      updateDraft({
        timeoutMode: "fixed",
        timeoutSeconds: Math.max(1, totalSecs),
      });
    }
    setPickerOpen(null);
  };

  return (
    <>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.settingsPage.timerConfig}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label>{t.settingsPage.focusDuration}</Label>
              <button
                onClick={openFocusPicker}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <span>{formatTimeDisplay(focusSeconds)}</span>
                <span className="text-muted-foreground">{t.settingsPage.tapToChange}</span>
              </button>
            </div>

            <div className="grid gap-3">
              <Label>{t.settingsPage.timeoutMode}</Label>
              <Select
                value={current.timeoutMode}
                onValueChange={(value: TimeoutMode) =>
                  updateDraft({ timeoutMode: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">{t.settingsPage.percentOfFocus}</SelectItem>
                  <SelectItem value="fixed">{t.settingsPage.fixedDuration}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {current.timeoutMode === "percent" ? (
              <div className="grid gap-3">
                <Label htmlFor="timeoutPercent">{t.settingsPage.timeoutPercent}</Label>
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <Slider
                    id="timeoutPercent"
                    min={5}
                    max={100}
                    step={1}
                    value={[timeoutPercent]}
                    onValueChange={(value) =>
                      updateDraft({ timeoutPercent: normalizePercent(value[0]) })
                    }
                  />
                  <Input
                    type="number"
                    min={5}
                    max={100}
                    value={current.timeoutPercent}
                    onChange={(e) =>
                      updateDraft({
                        timeoutPercent: normalizePercent(Number(e.target.value)),
                      })
                    }
                    className="md:w-24"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t.settingsPage.timeoutDuration}: {formatTimeDisplay(calculatedTimeoutSeconds)}
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                <Label>{t.settingsPage.timeoutDuration}</Label>
                <button
                  onClick={openTimeoutPicker}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <span>{formatTimeDisplay(timeoutSecondsFixed)}</span>
                  <span className="text-muted-foreground">{t.settingsPage.tapToChange}</span>
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.settingsPage.repeatSettings}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label>{t.settingsPage.repeatMode}</Label>
              <Select
                value={current.repeatMode}
                onValueChange={(value: RepeatMode) =>
                  updateDraft({ repeatMode: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">{t.timer.once}</SelectItem>
                  <SelectItem value="loop">{t.settingsPage.loopInfinite}</SelectItem>
                  <SelectItem value="custom">{t.settingsPage.customCount}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {current.repeatMode === "custom" && (
              <div className="grid gap-3">
                <Label htmlFor="repeatCount">{t.settingsPage.numberOfSessions}</Label>
                <Input
                  id="repeatCount"
                  type="number"
                  min={2}
                  max={10}
                  value={current.repeatCount}
                  onChange={(e) =>
                    updateDraft({
                      repeatCount: normalizeRepeatCount(Number(e.target.value)),
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {t.settingsPage.willRun.replace("{count}", String(current.repeatCount))}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.settingsPage.audioCues}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            {(["focusStart", "focusEnd", "timeoutStart", "timeoutEnd"] as const).map(
              (key) => (
                <div key={key} className="grid gap-3">
                  <Label>
                    {key === "focusStart"
                      ? t.settingsPage.focusStart
                      : key === "focusEnd"
                        ? t.settingsPage.focusEnd
                        : key === "timeoutStart"
                          ? t.settingsPage.timeoutStart
                          : t.settingsPage.timeoutEnd}
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={current.sounds[key]}
                      onValueChange={(value) =>
                        updateDraft({
                          sounds: { ...current.sounds, [key]: value },
                        })
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={t.settingsPage.selectSound} />
                      </SelectTrigger>
                      <SelectContent>
                        {soundOptions.map((option) => (
                          <SelectItem
                            key={option.value || "none"}
                            value={option.value || "none"}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => playPreview(current.sounds[key])}
                      disabled={!current.sounds[key]}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.settingsPage.customSounds}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              {t.settingsPage.uploadDescription}
            </p>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="sound-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {t.settingsPage.uploadSound}
              </Button>
            </div>

            {Object.keys(current.customSounds).length > 0 && (
              <div className="grid gap-2">
                {Object.entries(current.customSounds).map(([name, url]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <span className="text-sm">{name}</span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => playPreview(url)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCustomSound(name)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {isDirty && (
            <Button
              variant="ghost"
              onClick={() => {
                setDraft(null);
                setIsDirty(false);
              }}
            >
              {t.settingsPage.cancelChanges}
            </Button>
          )}
          <Button onClick={handleSave} disabled={!isDirty}>
            {t.settingsPage.saveSettings}
          </Button>
        </div>
      </div>

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
