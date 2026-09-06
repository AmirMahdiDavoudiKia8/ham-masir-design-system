import type { Mentor } from "@/lib/mentors";

/**
 * Calm, generic near-future windows — used only when a mentor has no
 * `availableSlots` of their own. This is request-based scheduling (the
 * student proposes, the mentor confirms), not a live calendar, so these
 * are plain labels, never real Date objects. Deliberately vague (day part,
 * not a clock time) — an exact time reads as a promise the mentor might
 * not actually be able to keep; the mentor settles on the real time when
 * confirming.
 */
const PLACEHOLDER_SLOTS = [
  "فردا صبح",
  "فردا عصر",
  "فردا شب",
  "پس‌فردا صبح",
  "پس‌فردا عصر",
  "پس‌فردا شب",
  "هیچ‌کدوم (پشتیبانی برای انتخاب زمان مناسب باهات تماس می‌گیره)",
];

export function getMentorSlots(mentor: Mentor): string[] {
  return mentor.availableSlots && mentor.availableSlots.length > 0
    ? mentor.availableSlots
    : PLACEHOLDER_SLOTS;
}
