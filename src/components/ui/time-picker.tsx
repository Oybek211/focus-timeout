"use client";

import WheelPicker from "./wheel-picker";
import { cn } from "@/lib/utils";

type TimePickerProps = {
  hours?: number;
  minutes: number;
  seconds?: number;
  onChangeHours?: (hours: number) => void;
  onChangeMinutes: (minutes: number) => void;
  onChangeSeconds?: (seconds: number) => void;
  showHours?: boolean;
  showSeconds?: boolean;
  maxHours?: number;
  maxMinutes?: number;
  className?: string;
};

const generateRange = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export default function TimePicker({
  hours = 0,
  minutes,
  seconds = 0,
  onChangeHours,
  onChangeMinutes,
  onChangeSeconds,
  showHours = false,
  showSeconds = false,
  maxHours = 23,
  maxMinutes = 59,
  className,
}: TimePickerProps) {
  const hourValues = generateRange(0, maxHours);
  const minuteValues = generateRange(0, maxMinutes);
  const secondValues = generateRange(0, 59);

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {showHours && onChangeHours && (
        <>
          <WheelPicker
            values={hourValues}
            value={hours}
            onChange={onChangeHours}
            label="hours"
          />
          <span className="text-2xl font-medium text-muted-foreground">:</span>
        </>
      )}

      <WheelPicker
        values={minuteValues}
        value={minutes}
        onChange={onChangeMinutes}
        label={showHours || showSeconds ? "min" : "minutes"}
      />

      {showSeconds && onChangeSeconds && (
        <>
          <span className="text-2xl font-medium text-muted-foreground">:</span>
          <WheelPicker
            values={secondValues}
            value={seconds}
            onChange={onChangeSeconds}
            label="sec"
          />
        </>
      )}
    </div>
  );
}
