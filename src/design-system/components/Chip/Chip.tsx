/**
 * Chip — SELECTION pill used for tabs and filters. Always a <button> with
 * aria-pressed; the native button carries the interaction.
 *
 * Role contract (vs Button/Tag/Badge): Chip is the ONLY toggle. Outline by
 * default (quiet, unchosen), filled action-primary when selected (unmissable
 * active state + brand glow, the only other glow beside Button primary).
 * Never use for plain labels (Tag) or statuses (Badge); never navigate (Button).
 *
 * Binds only to semantic tokens. No hardcoded hex.
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
        "inline-flex h-12 min-w-12 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-chip border px-4 text-caption font-semibold transition-colors duration-standard ease-gentle",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-transparent bg-action-primary text-action-primary-foreground shadow-brand hover:bg-action-primary-hover active:bg-action-primary-pressed"
          : "border-border-strong bg-surface text-foreground hover:border-border-focus hover:bg-action-ghost-hover active:bg-action-ghost-pressed",
        "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-muted disabled:text-disabled disabled:hover:border-border-disabled disabled:hover:bg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
export default Chip;
