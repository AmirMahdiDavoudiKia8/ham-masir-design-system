import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";

interface ProgressRingProps {
  /** 0-100 */
  percent: number;
  /** Outer diameter in px. Defaults to the large weekly-summary size. */
  size?: number;
  /** Stroke width in px. Defaults to a size-proportional value when omitted. */
  strokeWidth?: number;
  /** Percent label font size class. Defaults to the large weekly-summary size. */
  labelClassName?: string;
}

const DEFAULT_SIZE = 132;

/** A calm affirmation, not a scoreboard — the arc eases to its new length whenever a task is ticked. */
export function ProgressRing({ percent, size = DEFAULT_SIZE, strokeWidth, labelClassName }: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const stroke = strokeWidth ?? Math.max(4, Math.round(size * 0.09));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-surface-alt" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-all duration-standard ease-gentle"
        />
      </svg>
      <span className={cn("absolute font-bold text-foreground", labelClassName ?? "text-h1")}>
        {toPersianDigits(clamped)}٪
      </span>
    </div>
  );
}
