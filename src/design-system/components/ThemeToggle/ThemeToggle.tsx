/**
 * ThemeToggle — calm day/night switch for Ham-Masir.
 *
 * Brand: pill, surface bg, hairline border, 48px target, gentle 250ms color
 * transition, no bounce. Sun/moon glyphs are minimal line icons (never emoji).
 * Persian aria-label, `aria-pressed` reflects night state.
 *
 * Binds only to semantic tokens — the button itself looks identical in both
 * moods; only the page around it flips.
 *
 * Status: canonical — shipped in the site header.
 */
"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "./useTheme";

export interface ThemeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Override the hook (e.g. Storybook controls). */
  theme?: "light" | "dark";
  onToggle?: () => void;
}

export function ThemeToggle({ theme: themeProp, onToggle, className, ...props }: ThemeToggleProps) {
  const { theme: hookTheme, toggle: hookToggle, mounted } = useTheme();
  const theme = themeProp ?? hookTheme;
  const handleToggle = onToggle ?? hookToggle;
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-pressed={isDark}
      aria-label={isDark ? "تغییر به حالت روز" : "تغییر به حالت شب"}
      title={isDark ? "حالت روز" : "حالت شب"}
      onClick={handleToggle}
      suppressHydrationWarning={!mounted && themeProp === undefined}
      className={cn(
        "inline-flex min-h-[48px] min-w-[48px] cursor-pointer touch-manipulation items-center justify-center rounded-full",
        "border border-border bg-surface text-foreground shadow-card",
        "transition-[box-shadow,transform,background-color,border-color] duration-standard ease-gentle hover:shadow-floating active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="relative block h-5 w-5">
        {isDark ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" key="moon">
            <path
              d="M16.5 12.8A6.3 6.3 0 0 1 7.2 3.5a6.3 6.3 0 1 0 9.3 9.3Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" key="sun">
            <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}

export default ThemeToggle;
