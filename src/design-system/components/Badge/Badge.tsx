/**
 * Badge — SEMANTIC variants: the name describes what it MEANS
 * (pending / confirmed / cancelled — real booking states), not what it
 * looks like. If the color for "pending" changes, callers don't change.
 *
 * Status: retire-candidate — booking-status pills ship as Tag; keeping both
 * preserves a duplication.
 */
import * as React from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "pending" | "confirmed" | "cancelled";
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  pending: "bg-alert-soft text-alert-foreground",
  confirmed: "bg-primary-soft text-primary-soft-foreground", /* teal-700 5.13:1 light · teal-200 4.79:1 on lifted dark well */
  cancelled: "bg-muted text-muted-foreground",
};

export function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-badge border border-transparent px-2.5 py-1 text-label font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
export default Badge;
