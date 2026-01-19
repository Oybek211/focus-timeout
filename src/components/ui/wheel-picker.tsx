"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type WheelPickerProps = {
  values: number[];
  value: number;
  onChange: (value: number) => void;
  label?: string;
  formatValue?: (value: number) => string;
  className?: string;
  min?: number;
  max?: number;
};

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

export default function WheelPicker({
  values,
  value,
  onChange,
  label,
  formatValue = (v) => String(v).padStart(2, "0"),
  className,
  min = 0,
  max = 59,
}: WheelPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isScrollingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const selectedIndex = values.indexOf(value);

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const container = containerRef.current;
    if (!container) return;
    const scrollTop = index * ITEM_HEIGHT;
    container.scrollTo({
      top: scrollTop,
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  useEffect(() => {
    if (selectedIndex >= 0 && !isScrollingRef.current && !isEditing) {
      scrollToIndex(selectedIndex, false);
    }
  }, [selectedIndex, scrollToIndex, isEditing]);

  const handleScroll = useCallback(() => {
    if (isEditing) return;

    const container = containerRef.current;
    if (!container) return;

    isScrollingRef.current = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const scrollTop = container.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(values.length - 1, index));

      scrollToIndex(clampedIndex);

      if (values[clampedIndex] !== value) {
        onChange(values[clampedIndex]);
      }

      isScrollingRef.current = false;
    }, 100);
  }, [values, value, onChange, scrollToIndex, isEditing]);

  const handleSelectedClick = () => {
    setInputValue(String(value));
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleInputBlur = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num)) {
      const clamped = Math.max(min, Math.min(max, num));
      if (values.includes(clamped)) {
        onChange(clamped);
      }
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const paddingItems = Math.floor(VISIBLE_ITEMS / 2);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative h-[200px] w-20 overflow-hidden">
        {/* Selection highlight */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-10 h-10 -translate-y-1/2 rounded-lg bg-white/10" />

        {/* Top fade */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-20 bg-gradient-to-b from-card to-transparent" />

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-20 bg-gradient-to-t from-card to-transparent" />

        {/* Input overlay for manual entry */}
        {isEditing && (
          <div className="absolute left-0 right-0 top-1/2 z-30 flex h-10 -translate-y-1/2 items-center justify-center">
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="h-10 w-16 rounded-lg bg-white/20 text-center text-2xl font-medium text-foreground outline-none"
              min={min}
              max={max}
            />
          </div>
        )}

        <div
          ref={containerRef}
          onScroll={handleScroll}
          className={cn(
            "h-full snap-y snap-mandatory overflow-y-auto scrollbar-hide",
            isEditing && "opacity-0"
          )}
          style={{
            scrollSnapType: "y mandatory",
          }}
        >
          {/* Top padding */}
          {Array.from({ length: paddingItems }).map((_, i) => (
            <div key={`top-${i}`} className="h-10 w-full" />
          ))}

          {values.map((v, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={v}
                className={cn(
                  "flex h-10 w-full snap-center items-center justify-center text-2xl font-medium transition-all",
                  isSelected
                    ? "text-foreground scale-110 cursor-text"
                    : "text-muted-foreground/50 cursor-pointer"
                )}
                onClick={() => {
                  if (isSelected) {
                    handleSelectedClick();
                  } else {
                    scrollToIndex(index);
                    onChange(v);
                  }
                }}
              >
                {formatValue(v)}
              </div>
            );
          })}

          {/* Bottom padding */}
          {Array.from({ length: paddingItems }).map((_, i) => (
            <div key={`bottom-${i}`} className="h-10 w-full" />
          ))}
        </div>
      </div>
      {label && (
        <span className="mt-1 text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
