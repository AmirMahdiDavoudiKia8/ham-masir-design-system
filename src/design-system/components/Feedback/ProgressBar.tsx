/**
 * ProgressBar — thin rounded progress track for multi-step flows.
 *
 * - `value` is clamped to 0–100 inside the component; out-of-range and
 *   non-finite inputs can never break the layout.
 * - `ariaLabel` is REQUIRED: the bar has no visual label, so assistive tech
 *   needs it (WCAG 4.1.2). Never render a labelless progressbar.
 * - Track is always `w-full` + fixed `h-1.5`, so it never collapses — even in
 *   an isolated Storybook canvas (the old invisible-render bug). A `min-w-48`
 *   floor keeps it visible when a centered canvas shrink-wraps the story to
 *   zero width; inside full-width product layouts it is a no-op.
 * - Track is a fixed-direction `ltr` region, so the fill always grows
 *   left-to-right — in the sample and in the Controls-table slider alike
 *   (explicit review decision: progress reads LTR even on RTL pages).
 *   No physical margins anywhere near it.
 * - `aria-valuenow` is rounded to an integer so screen readers announce a
 *   clean number while the visual width keeps full precision.
 * - Fill is solid semantic `bg-primary` on a `bg-muted` track (never a
 *   two-hue gradient — brand law). Width animates via token motion
 *   (`duration-standard` + `ease-gentle`), never hardcoded durations.
 * - RTL-safe: the bar is an isolated `ltr` region, so page direction never
 *   affects it; no physical margins.
 *
 * Binds only to semantic tokens — `.dark` flips automatically, no `dark:`
 * overrides. Text pair N/A (no text); track/fill contrast is graphical.
 *
 * Status: canonical — shipped in discovery, onboarding and planner flows.
 */
import { cn } from "@/lib/cn";

export interface ProgressBarProps {
  /** Progress value. Clamped to 0–100 inside the component. */
  value: number;
  /** Accessible name — REQUIRED (WCAG 4.1.2). Describes what the bar measures. */
  ariaLabel: string;
  /** امکان اعمال کلاس‌های CSS سفارشی برای تغییر چیدمان محفظهٔ نوار پیشرفت */
  className?: string;
}

export function ProgressBar({ value, ariaLabel, className }: ProgressBarProps) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const clampedValue = Math.min(100, Math.max(0, safeValue));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clampedValue)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      dir="ltr"
      className={cn("flex h-1.5 w-full min-w-48 overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        aria-hidden
        className="h-full rounded-full bg-primary transition-[width] duration-standard ease-gentle"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
export default ProgressBar;
