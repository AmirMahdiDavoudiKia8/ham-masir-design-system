const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const ARABIC_INDIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

// U+200B ZWSP, U+200C ZWNJ, U+200D ZWJ, U+200E LRM, U+200F RLM, U+FEFF BOM —
// built with String.fromCharCode + a string-source RegExp (not a /regex/
// literal) so the source file itself never has to carry any of these
// invisible characters as literal bytes.
const ZERO_WIDTH_CHARS = new RegExp(
  `[${String.fromCharCode(0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0xfeff)}]`,
  "g",
);

/**
 * Normalizes the classic Arabic/Persian keyboard look-alikes that read as
 * identical text but aren't the same Unicode codepoints: Arabic Yeh "ي"
 * (U+064A) vs Persian "ی" (U+06CC), Arabic Kaf "ك" (U+0643) vs Persian "ک"
 * (U+06A9), Arabic-Indic digits "٠-٩" vs Persian "۰-۹", plus the zero-width
 * characters above, which some mobile keyboards insert inconsistently
 * between otherwise-identical retypes. Without this, two password fields a
 * person believes they typed identically (one via an "Arabic" keyboard
 * layout, common on phones defaulting to it for Persian input, the other via
 * a "Persian" one) compare as different strings with zero visible sign why —
 * see registerMentor/findMentorByCredentials and the student equivalents.
 */
export function normalizePersianText(value: string): string {
  return value
    .replace(/ي/g, "ی") // Arabic Yeh "ي" -> Persian "ی"
    .replace(/ك/g, "ک") // Arabic Kaf "ك" -> Persian "ک"
    .replace(/[٠-٩]/g, (d) => String(ARABIC_INDIC_DIGITS.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(ZERO_WIDTH_CHARS, "");
}

/** Converts ASCII digits in a number/string to Persian digits for display. */
export function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** Formats a toman amount with thousands separators, in Persian digits. */
export function formatToman(value: number): string {
  return toPersianDigits(value.toLocaleString("en-US"));
}

/** Strips everything but digits from input (Persian digits normalized to ASCII first) — used to keep phone-number fields numeric-only as the user types. */
export function digitsOnly(value: string): string {
  const ascii = value.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
  return ascii.replace(/\D/g, "");
}

/** Extracts the first run of digits (Persian or ASCII) out of free text, e.g. "رتبه ۱۷۶ منطقه ۲" -> 176. Returns undefined when there are no digits at all (e.g. "رتبه دو رقمی"). */
export function parsePersianNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const ascii = value.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
  const match = ascii.match(/\d+/);
  if (!match) return undefined;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Mentor data stores rank as "کنکور ۱۴۰۳ — رتبه ۱۷۶ منطقه دو" (year leads,
 * since that's how the source data reads). Card display wants the rank
 * leading with the year as a trailing detail instead: "رتبه ۱۷۶ منطقه دو ,
 * ۱۴۰۳". Falls back to the raw string for anything that doesn't match this
 * "کنکور YEAR — REST" shape.
 */
export function formatRankForCard(rank: string): string {
  const match = rank.match(/^کنکور\s*(\S+)\s*—\s*(.+)$/);
  if (!match) return rank;
  const [, year, rest] = match;
  return `${rest} , ${year}`;
}
