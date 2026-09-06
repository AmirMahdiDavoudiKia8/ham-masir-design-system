import { parsePersianNumber } from "@/lib/format";
import type { PlanDay } from "@/lib/progress";

/**
 * Pure, browser-safe calendar-day helpers — kept out of lib/progress.ts
 * because that file reads local JSON via node:fs and can only run
 * server-side. Client components (ProgressHome) need these two functions,
 * so they live here instead.
 */

/** Calendar day-of-month for a PlanDay, parsed out of its dateLabel (e.g. "۱۲ اردیبهشت" -> ۱۲). */
export function planDayNumber(day: PlanDay): number | undefined {
  return parsePersianNumber(day.dateLabel);
}

const RELATIVE_DAY_OFFSETS: [word: string, offset: number][] = [
  // "پس‌فردا" must be checked before "فردا" — it contains "فردا" as a substring.
  ["پس‌فردا", 2],
  ["امشب", 0],
  ["امروز", 0],
  ["فردا", 1],
];

/**
 * Best-effort mapping from a booking's proposed-time label (e.g. "فردا،
 * ساعت ۱۱:۰۰" or "سه‌شنبه، ساعت ۱۸:۰۰") to a calendar day-of-month, so the
 * Progress calendar can mark which day has a mentor session. This is
 * inherently approximate — slots are plain request-based labels, not real
 * dates (see lib/slots.ts) — so an unrecognized label just returns
 * undefined and the calendar simply won't mark a day, rather than guessing
 * wrong.
 */
export function resolveSessionDay(
  slotLabel: string,
  todayDay: number,
  weekdayNameToDay: Record<string, number>,
): number | undefined {
  for (const [word, offset] of RELATIVE_DAY_OFFSETS) {
    if (slotLabel.includes(word)) return todayDay + offset;
  }
  for (const [weekday, day] of Object.entries(weekdayNameToDay)) {
    if (slotLabel.includes(weekday)) return day;
  }
  return undefined;
}
