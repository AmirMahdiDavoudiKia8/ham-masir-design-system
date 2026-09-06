"use client";

import { toPersianDigits } from "@/lib/format";

interface PlannerSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

/**
 * Single-thumb range slider built on the `.range-thumb` CSS convention
 * already defined in globals.css for the (currently unused) dual-thumb
 * filter — reused here for the study-hours and estimated-percent inputs.
 * Left un-dir'd so it inherits the page's RTL direction natively (higher
 * value fills toward the right, matching the rest of the RTL UI) rather
 * than forcing LTR like PhoneStep does for purely numeric entry.
 */
export function PlannerSlider({ label, value, min, max, step = 1, unit = "", onChange }: PlannerSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-body font-semibold text-foreground">{label}</span>
        <span className="text-body font-bold text-primary">
          {toPersianDigits(value)}
          {unit}
        </span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-muted">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-primary to-secondary"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="range-thumb absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
    </div>
  );
}
