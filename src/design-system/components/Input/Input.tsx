/**
 * Input — label + field + error. Focus is a native browser event (Tailwind
 * focus: variant), error is a prop (comes from validation logic).
 * Visible leader-teal focus ring; calm Persian error text under the field.
 *
 * Status: canonical — shipped across product forms.
 */
import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** آیکون ابتدای فیلد (مانند ذره‌بین). این آیکون جنبه تزئینی داشته و از صفحه‌خوان‌ها (AT) پنهان می‌شود. */
  startIcon?: React.ReactNode;
  /** آیکون انتهای فیلد. این آیکون جنبه تزئینی داشته و از صفحه‌خوان‌ها (AT) پنهان می‌شود. */
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, startIcon, endIcon, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-caption text-muted-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <span aria-hidden className="pointer-events-none absolute inset-y-0 start-0 flex w-12 items-center justify-center text-foreground-faint">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              "h-12 w-full rounded-input border border-border-strong bg-surface px-4 text-body-sm text-foreground",
              "placeholder:text-muted-foreground transition-colors duration-standard ease-gentle",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              error ? "border-border-danger" : "hover:border-border-focus focus-visible:border-border-focus",
              "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-muted disabled:text-disabled",
              startIcon ? "ps-12" : "",
              endIcon ? "pe-12" : "",
              className,
            )}
            {...props}
          />
          {endIcon && (
            <span aria-hidden className="pointer-events-none absolute inset-y-0 end-0 flex w-12 items-center justify-center text-foreground-faint">
              {endIcon}
            </span>
          )}
        </div>
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
Input.displayName = "Input";
export default Input;
