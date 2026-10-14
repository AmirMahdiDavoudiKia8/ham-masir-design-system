/**
 * Badge — STATUS indicator: the name describes what it MEANS
 * (pending / confirmed / cancelled — real booking states), not what it
 * looks like. If the color for "pending" changes, callers don't change.
 *
 * Role contract (vs Tag): Badge = booking/lifecycle STATUS, bound strictly to
 * the feedback triples (bg + text + border ship together) — warning for
 * pending, success for confirmed, danger for cancelled. Tag = neutral
 * CATEGORIZATION (field/city/availability, single borderless peach tint).
 * The visible feedback border is what sets Badge apart from Tag at a glance.
 * Badge is fully rounded with smaller label-sm text. Both are <span>:
 * non-interactive, no hover, no focus. For selection use Chip; for actions
 * use Button.
 *
 * Binds only to semantic tokens (feedback-*). Dark mode flips automatically
 * via the semantic layer — no `dark:` overrides. No hardcoded hex.
 *
 * Status: canonical — the status pill; Tag stays the categorization pill.
 */
import * as React from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "pending" | "confirmed" | "cancelled";
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  pending: "border-feedback-warning-border bg-feedback-warning-bg text-feedback-warning-text",
  confirmed: "border-feedback-success-border bg-feedback-success-bg text-feedback-success-text",
  cancelled: "border-feedback-danger-border bg-feedback-danger-bg text-feedback-danger-text",
};

export function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-center whitespace-nowrap rounded-badge border px-3 py-1 text-label-sm font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
export default Badge;
