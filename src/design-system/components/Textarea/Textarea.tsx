/**
 * Textarea — same contract as Input (label + error-as-prop, native focus).
 *
 * Status: pending-decision — product ships raw textareas in three places
 * with two different visual specs; align on one canonical style before adopting.
 */
import * as React from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className, rows = 4, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-caption text-muted-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            "w-full rounded-input border bg-surface px-4 py-3 text-body text-foreground",
            "placeholder:text-muted-foreground transition-colors duration-standard ease-gentle",
            "focus:outline-none focus:ring-2 focus:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            error ? "border-danger" : "border-border-strong hover:border-primary-light focus:border-primary focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-muted disabled:text-disabled",
            className,
          )}
          {...props}
        />
        {hint && !error && (
          <span id={`${inputId}-hint`} className="text-caption text-muted-foreground">
            {hint}
          </span>
        )}
        {error && (
          <span id={`${inputId}-error`} role="alert" className="flex items-center gap-1.5 text-caption font-semibold text-feedback-danger-text">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M7 4v3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="7" cy="9.8" r="0.9" fill="currentColor" />
            </svg>
            {error}
          </span>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
export default Textarea;
