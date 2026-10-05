import { toPersianDigits } from "@/lib/format";

interface ProfileCompletionGaugeProps {
  /** 0-100 */
  percent: number;
}

const SIZE = 84;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Full-circle profile-completion gauge for the top card — same arc mechanics as features/progress/ProgressRing, just sized for a card instead of a full-width hero. */
export function ProfileCompletionGauge({ percent }: ProfileCompletionGaugeProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-surface-alt" />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="stroke-primary transition-all duration-standard ease-gentle"
        />
      </svg>
      <span className="absolute text-body font-bold text-foreground">{toPersianDigits(clamped)}٪</span>
    </div>
  );
}
