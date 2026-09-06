interface ProgressBarProps {
  /** 0-100 */
  value: number;
}

/** Thin rounded progress track used at the top of multi-step flows. */
export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="h-full rounded-full bg-gradient-to-l from-primary to-secondary transition-[width] duration-standard ease-gentle"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
