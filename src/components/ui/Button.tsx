import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "outline-brand" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Fully-rounded pill shape (used for standalone CTAs like a card's reserve button) instead of the default rounded-md. */
  pill?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-l from-primary-hover to-primary text-primary-foreground shadow-brand hover:brightness-105 active:brightness-95",
  secondary:
    "bg-secondary-soft text-secondary-foreground border border-secondary/40 hover:bg-secondary/25",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  "outline-brand":
    "border-[1.5px] border-primary-light bg-transparent text-primary hover:bg-primary-soft",
  ghost: "bg-transparent text-foreground hover:bg-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-caption",
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
    "inline-flex cursor-pointer items-center justify-center gap-2 font-bold transition-all duration-standard ease-gentle active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
    pill ? "rounded-full" : "rounded-md",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
