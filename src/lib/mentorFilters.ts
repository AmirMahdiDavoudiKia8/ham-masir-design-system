import { parsePersianNumber } from "@/lib/format";

/** A single written review — the qualitative text is the point; the rating only supports it (canon A.3). */
export interface MentorReview {
  id: string;
  text: string;
  authorLabel: string;
  rating: number;
}

/**
 * Every field but `id` is optional on purpose: this reads user-supplied
 * local JSON with no validation step, and the UI must degrade gracefully
 * (hide the row) rather than crash when a field is missing or malformed.
 */
export interface Mentor {
  id: string;
  name?: string;
  /** Path under /public, e.g. "/mentors/sara.jpg". Falls back to a placeholder icon when absent. */
  photo?: string;
  verified?: boolean;
  field?: string;
  university?: string;
  rank?: string;
  rating?: number;
  reviewsCount?: number;
  /** Toman, e.g. "۱۲۰ هزار تومان". One-hour session. */
  sessionPrice?: string;
  /** Toman, e.g. "۹۰۰ هزار تومان". One-month subscription. */
  subscriptionPrice?: string;
  track?: string;
  gender?: string;
  /** Request-based windows the mentor is open to, e.g. "فردا، ساعت ۱۸:۰۰". Falls back to placeholder slots when absent. */
  availableSlots?: string[];

  // Narrative fields (canon Part V — "a profile is a narrative, not a résumé"). Each is optional; the profile page hides its section when absent rather than rendering an empty one.
  /** Who they are — a short, human intro. */
  bio?: string;
  /** The path they walked — canon's "مسیری که رفته". */
  journey?: string;
  /** What that journey taught them — canon's "چیزی که یاد گرفته". */
  lessons?: string;
  /** Who benefits from their experience — short list, e.g. ["پشت‌کنکوری‌ها", "کسایی که استرس جلسه دارن"]. */
  helpsWith?: string[];
  /** General availability windows for context (not a live calendar), e.g. "عصرها بعد از ساعت ۱۸". */
  availabilityWindows?: string[];
  reviews?: MentorReview[];
  /** Path under /public to an intro voice clip (name, rank, field/university, konkur year) — played on the profile page when present. */
  voiceIntro?: string;
  /**
   * Which match-quiz answers (see MatchQuizFlow) this mentor's own bio
   * actually speaks to — hand-tagged from their journey/lessons/helpsWith
   * text, never guessed for a dimension their bio doesn't address. Only
   * `mainProblem` and `distraction` are populated today: the quiz's
   * studyTime/wastedTime questions ask about study habits no mentor's bio
   * happens to describe, and tagging those would be inventing a claim about
   * a real person that isn't there. See filterMentors for how an absent tag
   * set is treated (never excludes) vs. a present-but-non-matching one (does).
   */
  matchTags?: {
    mainProblem?: string[];
    distraction?: string[];
  };
}

export interface MentorFilters {
  track?: string;
  /** City or free-text university name — matched as a substring against Mentor.university. */
  university?: string;
  field?: string;
  gender?: string;
  rankMin?: number;
  rankMax?: number;
  /** From the match quiz — see Mentor.matchTags for the matching semantics. */
  mainProblem?: string;
  distraction?: string;
}

/**
 * `Mentor.rank` is free-text for display, and almost always leads with the
 * konkur year before the actual rank — "کنکور ۱۴۰۳ — رتبه ۱۷۶ منطقه دو".
 * parsePersianNumber alone would grab that leading year (۱۴۰۳), not the
 * rank, so this looks specifically for the digits right after "رتبه" first
 * and only falls back to "first digit run in the string" for the rare
 * mentor whose rank text doesn't follow that shape. Text-only ranks like
 * "رتبه دو رقمی" have no digits and return undefined, same as a mentor with
 * no rank at all.
 */
export function parseRankValue(rank: string | undefined): number | undefined {
  if (!rank) return undefined;
  const afterRankWord = rank.split("رتبه")[1];
  return parsePersianNumber(afterRankWord) ?? parsePersianNumber(rank);
}

/**
 * Applies the discovery screen's filters to a mentor list. Every check is
 * skipped when its filter is absent, and a mentor with a missing field
 * simply never matches that filter (never crashes). University and field of
 * study both use a loose substring match, since both are free-text inputs
 * on the discovery form — university mixes city names ("تهران") and short
 * institution names ("شریف"), and an exact match would miss too much either way.
 *
 * The rank range is only active when the caller actually sent rankMin/
 * rankMax — the slider always has *some* value, so DiscoveryForm only
 * forwards it once the user has actually moved a thumb, otherwise a mentor
 * with no parseable rank would be excluded by a filter nobody touched. Once
 * active, a mentor whose rank can't be parsed to a number is excluded,
 * matching every other filter's "missing field never matches" rule.
 *
 * Kept in its own module (no fs/path imports, unlike lib/mentors.ts) so
 * client components — e.g. DiscoveryForm's live result count — can import
 * it directly without pulling node builtins into the browser bundle.
 *
 * `mainProblem`/`distraction` (quiz-derived, see Mentor.matchTags) follow a
 * deliberately different rule than every other filter here: a mentor with
 * *no* tags for that dimension is never excluded by it — their bio simply
 * didn't happen to address it, which isn't the same as not matching. Only a
 * mentor who *is* tagged for that dimension, with different answers than the
 * one asked for, gets excluded.
 */
export function filterMentors(mentors: Mentor[], filters: MentorFilters): Mentor[] {
  return mentors.filter((mentor) => {
    if (filters.track && mentor.track !== filters.track) return false;
    if (filters.field && !mentor.field?.includes(filters.field)) return false;
    if (filters.gender && mentor.gender !== filters.gender) return false;
    if (filters.university && !mentor.university?.includes(filters.university)) return false;

    if (filters.mainProblem) {
      const tags = mentor.matchTags?.mainProblem;
      if (tags && tags.length > 0 && !tags.includes(filters.mainProblem)) return false;
    }
    if (filters.distraction) {
      const tags = mentor.matchTags?.distraction;
      if (tags && tags.length > 0 && !tags.includes(filters.distraction)) return false;
    }

    if (filters.rankMin !== undefined || filters.rankMax !== undefined) {
      const rankValue = parseRankValue(mentor.rank);
      if (rankValue === undefined) return false;
      if (filters.rankMin !== undefined && rankValue < filters.rankMin) return false;
      if (filters.rankMax !== undefined && rankValue > filters.rankMax) return false;
    }

    return true;
  });
}
