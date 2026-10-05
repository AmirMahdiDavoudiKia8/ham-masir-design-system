"use client";

import { Chip } from "@/design-system";
import { XIcon } from "@/design-system";
import type { MentorFilters } from "@/lib/mentorFilters";

interface ResultsBarProps {
  filters: MentorFilters;
  /** Clears the given filter keys in the caller's own state — no navigation, results update in place. */
  onRemove: (keys: (keyof MentorFilters)[]) => void;
}

/** The filter chips that produced the current results — each removable, re-running the search without it. */
export function ResultsBar({ filters, onRemove }: ResultsBarProps) {
  const chips: { keys: (keyof MentorFilters)[]; label: string }[] = [
    filters.track && { keys: ["track"], label: filters.track },
    filters.university && { keys: ["university"], label: filters.university },
    filters.field && { keys: ["field"], label: filters.field },
    filters.gender && { keys: ["gender"], label: filters.gender },
  ].filter((c): c is { keys: (keyof MentorFilters)[]; label: string } => Boolean(c));

  if (chips.length === 0) return null;

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
      {chips.map((chip) => (
        <Chip
          key={chip.keys.join("-")}
          selected
          className="shrink-0"
          onClick={() => onRemove(chip.keys)}
          aria-label={`حذف فیلتر ${chip.label}`}
        >
          {chip.label}
          <XIcon className="h-3.5 w-3.5" />
        </Chip>
      ))}
    </div>
  );
}
