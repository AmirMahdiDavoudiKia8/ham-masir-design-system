/**
 * Button — the single ACTION control for everything the student does in
 * HamMasir, from «رزرو جلسه» to «انصراف».
 *
 * Role contract (vs Chip/Tag/Badge): Button is the ONLY one that triggers an
 * action. It is always a <button>/<a>, always has a prominent hover state
 * (token hover/pressed backgrounds), and is the only one allowed the brand
 * glow (primary variant). Chip = selection, Tag = categorization, Badge =
 * status — none of those may look like this.
 *
 * Variant axis → variant (primary | secondary | outline | outline-brand | ghost).
 * Primary is the filled action for the ONE main action per screen.
 * Size axis    → size (md | lg).
 * State axis   → native :hover / :focus-visible / :disabled.
 *                Focus is a real browser event, never a prop.
 * Shape        → pill for standalone CTAs (a card's reserve button), otherwise rounded-button.
 *
 * Binds only to semantic tokens (action-*, border-*, background).
 * Text-bearing fills use action-* (AA); brand primary-500 is decorative only.
 *
 * Status: canonical — shipped across product screens.
 */
import * as React from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "outline-brand" | "ghost";
export type ButtonSize = "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Fully-rounded pill shape (used for standalone CTAs like a card's reserve button) instead of the default rounded-button. */
  pill?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-action-primary text-action-primary-foreground shadow-brand hover:bg-action-primary-hover active:bg-action-primary-pressed",
  secondary:
    "border border-secondary/40 bg-action-secondary text-action-secondary-foreground hover:bg-action-secondary-hover active:bg-action-secondary-pressed",
  outline: "border border-border-strong bg-transparent text-foreground hover:bg-action-ghost-hover active:bg-action-ghost-pressed",
  "outline-brand":
    "border-medium border-action-primary bg-transparent text-action-primary hover:bg-action-ghost-hover active:bg-action-ghost-pressed",
  ghost: "bg-transparent text-foreground hover:bg-action-ghost-hover active:bg-action-ghost-pressed",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-12 px-4 text-caption",
  lg: "h-14 px-6 text-body",
};

/**
 * Shared class builder so non-<button> elements (e.g. a Next.js <Link> that
 * must render an <a>) can look identical to Button without duplicating the
 * variant styles by hand.
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  fullWidth?: boolean,
  className?: string,
  pill?: boolean,
) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 font-bold transition-colors duration-standard ease-gentle disabled:cursor-not-allowed disabled:opacity-50",
    pill ? "rounded-full" : "rounded-button",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", fullWidth, pill, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={buttonClasses(variant, size, fullWidth, className, pill)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
export default Button;
