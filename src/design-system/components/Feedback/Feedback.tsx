/** Spinner — calm ring. Prefer Skeleton for loading states (no anxious spinners).
 * Status: proposal — generic reserve, not yet adopted by product. */
import { cn } from "@/lib/cn";
export function Spinner({ label = "در حال بارگذاری", className }: { label?: string; className?: string }) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      <span className="text-caption text-muted-foreground">{label}</span>
    </span>
  );
}
/** Skeleton — soft pulse placeholder.
 * Status: proposal — generic reserve, not yet adopted by product. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-sm bg-muted", className)} />;
}
/** ProgressBar — thin rounded progress track used at the top of multi-step flows.
 * Status: canonical — shipped in discovery, onboarding and planner flows. */
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="h-full rounded-full bg-gradient-to-l from-primary to-secondary transition-[width] duration-standard ease-gentle"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
