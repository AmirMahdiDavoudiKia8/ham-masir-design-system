import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-standard ease-gentle focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
