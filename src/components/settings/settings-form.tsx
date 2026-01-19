"use client";

import { useRef, useMemo, useState } from "react";
import { Upload, Trash2, Play } from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import { getSoundOptions, fileToBase64 } from "@/lib/sounds";
import { Settings, TimeoutMode, RepeatMode } from "@/lib/storage";
import { useSettings } from "@/hooks/use-settings";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalizeFocus = (value: number) => clamp(value || 1, 1, 180);
const normalizePercent = (value: number) => clamp(value || 10, 5, 100);
const normalizeTimeout = (value: number) => clamp(value || 1, 1, 60);
const normalizeRepeatCount = (value: number) => clamp(value || 2, 2, 10);

export default function SettingsForm() {
  const { settings, updateSettings } = useSettings();
  const [draft, setDraft] = useState<Settings | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = isDirty && draft ? draft : settings;
  const soundOptions = useMemo(
    () => getSoundOptions(current.customSounds),
    [current.customSounds]
  );

  const focusMinutes = normalizeFocus(Number(current.focusMinutes));
  const timeoutPercent = normalizePercent(Number(current.timeoutPercent));
  const timeoutMinutesFixed = normalizeTimeout(Number(current.timeoutMinutes));

  const calculatedTimeoutMinutes = useMemo(
    () =>
      current.timeoutMode === "percent"
        ? Number(((focusMinutes * timeoutPercent) / 100).toFixed(1))
        : timeoutMinutesFixed,
    [focusMinutes, timeoutPercent, timeoutMinutesFixed, current.timeoutMode]
  );

  const updateDraft = (next: Partial<Settings>) => {
    const base = isDirty && draft ? draft : settings;
    setDraft({ ...base, ...next });
    setIsDirty(true);
  };

  const handleSave = () => {
    updateSettings({
      ...current,
      focusMinutes,
      timeoutPercent,
      timeoutMinutes: timeoutMinutesFixed,
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

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Timer Configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="focusMinutes">Focus duration (minutes)</Label>
            <Input
              id="focusMinutes"
              type="number"
              min={1}
              max={180}
              value={current.focusMinutes}
              onChange={(e) =>
                updateDraft({
                  focusMinutes: normalizeFocus(Number(e.target.value)),
                })
              }
            />
          </div>

          <div className="grid gap-3">
            <Label>Timeout mode</Label>
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
                <SelectItem value="percent">Percentage of focus</SelectItem>
                <SelectItem value="fixed">Fixed duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {current.timeoutMode === "percent" ? (
            <div className="grid gap-3">
              <Label htmlFor="timeoutPercent">Timeout percentage</Label>
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
                Timeout duration: {calculatedTimeoutMinutes} minutes
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              <Label htmlFor="timeoutMinutes">Timeout duration (minutes)</Label>
              <Input
                id="timeoutMinutes"
                type="number"
                min={1}
                max={60}
                value={current.timeoutMinutes}
                onChange={(e) =>
                  updateDraft({
                    timeoutMinutes: normalizeTimeout(Number(e.target.value)),
                  })
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Repeat Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label>Repeat mode</Label>
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
                <SelectItem value="once">Once</SelectItem>
                <SelectItem value="loop">Loop (infinite)</SelectItem>
                <SelectItem value="custom">Custom count</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {current.repeatMode === "custom" && (
            <div className="grid gap-3">
              <Label htmlFor="repeatCount">Number of sessions</Label>
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
                Will run {current.repeatCount} focus + timeout sessions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audio Cues</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          {(["focusStart", "focusEnd", "timeoutStart", "timeoutEnd"] as const).map(
            (key) => (
              <div key={key} className="grid gap-3">
                <Label>
                  {key === "focusStart"
                    ? "Focus start"
                    : key === "focusEnd"
                      ? "Focus end"
                      : key === "timeoutStart"
                        ? "Timeout start"
                        : "Timeout end"}
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
                      <SelectValue placeholder="Select sound" />
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
          <CardTitle>Custom Sounds</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Upload your own audio files to use as notification sounds.
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
              Upload sound
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
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={!isDirty}>
          Save settings
        </Button>
      </div>
    </div>
  );
}
