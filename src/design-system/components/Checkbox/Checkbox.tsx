/**
 * Checkbox — native checked/disabled, styled with Tailwind.
 * The native input stays the source of truth (keyboard + screen readers);
 * a peer-styled box draws the visuals, including a real check glyph —
 * fill color alone is too weak a checked signal.
 * Label wraps input + box: one shared hit target, no dead zones.
 *
 * Status: retire-candidate — no checkboxes exist anywhere in the product.
 */
import * as React from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className, disabled, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
      <label
        htmlFor={inputId}
        className={cn(
          "group inline-flex min-h-[44px] cursor-pointer touch-manipulation items-center gap-2.5 text-body text-foreground",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <input ref={ref} id={inputId} type="checkbox" disabled={disabled} className="peer sr-only" {...props} />
        <span
          aria-hidden
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-xs border border-border-strong bg-surface",
            "transition-colors duration-standard ease-gentle",
            "group-hover:border-primary",
            "peer-checked:border-primary peer-checked:bg-primary",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
            "peer-disabled:cursor-not-allowed",
            "peer-checked:[&>svg]:opacity-100",
          )}
        >
          <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-3 w-3 text-primary-foreground opacity-0 transition-opacity duration-micro">
            <path d="m2.5 6.2 2.4 2.4 4.6-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {label}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";
export default Checkbox;
