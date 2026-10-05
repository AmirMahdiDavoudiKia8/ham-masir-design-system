/**
 * Chip — selectable pill used for tabs, filters, and tags.
 * aria-pressed carries the state; the native button carries the interaction.
 *
 * Status: canonical — shipped in discovery, planner and portal filters.
 */
import * as React from "react";
import { cn } from "@/lib/cn";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ selected = false, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex h-11 min-w-[44px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-caption font-semibold transition-all duration-standard ease-gentle active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-brand"
          : "border-border bg-surface text-foreground hover:border-primary-light hover:bg-primary-soft",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
export default Chip;
