"use client";

import { cn } from "@/lib/cn";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Selectable option card — same visual language as MatchQuizFlow's step
 * options (see features/discovery/components/MatchQuizFlow.tsx), reused
 * across every planner step instead of Chip, since several option labels
 * here are full sentences that need to wrap rather than stay on one line.
 */
export function OptionButton({ label, selected, onClick, className }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg border px-3 py-4 text-center transition-all duration-standard ease-gentle active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-primary bg-gradient-to-l from-primary-hover to-primary text-primary-foreground shadow-brand"
          : "border-border bg-surface text-foreground hover:border-primary-light hover:bg-primary-soft",
        className,
      )}
    >
      <span className="text-body font-bold">{label}</span>
    </button>
  );
}
