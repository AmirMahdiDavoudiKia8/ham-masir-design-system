"use client";

import { cn } from "@/lib/cn";

const EXAM_TRACKS = ["ریاضی", "تجربی", "انسانی"];

/** Kept out of the main sliding-indicator pill (still finding its footing on mentor count), but styled the same weight as the other three below it. */
const MINOR_TRACK = "هنر/زبان";

interface ExamTrackTabsProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Single-select exam-track segmented control with a sliding indicator.
 * The indicator is width:1/3 anchored to the physical left edge; because the
 * page is RTL, the first (DOM-order) tab renders in the rightmost slot, so
 * its offset from the left is (itemCount - 1 - index) slots — see transform below.
 * Values are the Persian labels directly (they match Mentor.track as-is).
 *
 * `value` can be empty ("every track", no filter applied) — the indicator
 * just hides itself rather than resting on a track that isn't selected.
 * Tapping the already-selected tab clears it back to that state (see
 * DiscoveryForm's handleTrackChange). MINOR_TRACK is a second row below the
 * main pill, same height/weight/selected-state styling as the other three,
 * just kept out of the shared sliding indicator since it's its own row.
 */
export function ExamTrackTabs({ value, onChange }: ExamTrackTabsProps) {
  const selectedIndex = EXAM_TRACKS.indexOf(value);
  const slotsFromLeft = EXAM_TRACKS.length - 1 - Math.max(selectedIndex, 0);
  const isMinorSelected = value === MINOR_TRACK;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex rounded-full bg-muted p-1">
        <span
          aria-hidden
          className={cn(
            "absolute bottom-1 left-1 top-1 w-1/3 rounded-full bg-gradient-to-l from-primary-hover to-primary shadow-brand transition-all duration-standard ease-gentle",
            selectedIndex === -1 && "opacity-0",
          )}
          style={{ transform: `translateX(${slotsFromLeft * 100}%)` }}
        />
        {EXAM_TRACKS.map((track) => {
          const isSelected = value === track;
          return (
            <button
              key={track}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onChange(track)}
              className={cn(
                "relative z-10 h-11 flex-1 cursor-pointer rounded-full text-sm font-bold transition-colors duration-standard ease-gentle",
                isSelected ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {track}
            </button>
          );
        })}
      </div>

      <div className="flex rounded-full bg-muted p-1">
        <button
          type="button"
          role="tab"
          aria-selected={isMinorSelected}
          onClick={() => onChange(MINOR_TRACK)}
          className={cn(
            "h-11 w-full cursor-pointer rounded-full text-sm font-bold transition-colors duration-standard ease-gentle",
            isMinorSelected
              ? "bg-gradient-to-l from-primary-hover to-primary text-primary-foreground shadow-brand"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {MINOR_TRACK}
        </button>
      </div>
    </div>
  );
}
