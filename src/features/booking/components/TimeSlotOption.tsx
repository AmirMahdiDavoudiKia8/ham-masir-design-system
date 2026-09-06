"use client";

import { CheckIcon, ClockIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface TimeSlotOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

/** Single proposable time window — same selected-state visual language as PlanOption, so the two single-select moments in this flow read as one system. */
export function TimeSlotOption({ label, selected, onClick }: TimeSlotOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex min-h-[48px] w-full items-center gap-2.5 rounded-md border-2 px-4 py-3 text-right transition-all duration-standard ease-gentle active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        selected ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-primary-light",
      )}
    >
      <ClockIcon
        className={cn("h-[18px] w-[18px] shrink-0", selected ? "text-primary" : "text-muted-foreground")}
      />
      <span className={cn("flex-1 text-sm font-semibold", selected ? "text-primary" : "text-foreground")}>
        {label}
      </span>
      <span
        aria-hidden
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-standard ease-gentle",
          selected ? "border-primary bg-primary" : "border-border bg-surface",
        )}
      >
        {selected && <CheckIcon className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
      </span>
    </button>
  );
}
