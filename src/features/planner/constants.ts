import type { GoalTier, Phase, SelfRating, SubjectKey, Track } from "./types";

/** Sanjesh's official coefficients per track — the base priority of each subject before self-assessment adjusts it. */
export const BASE_WEIGHTS: Record<Track, Partial<Record<SubjectKey, number>>> = {
  tajrobi: { zist: 12, shimi: 9, riazi: 7, fizik: 7 },
  riazi: { riazi: 12, fizik: 9, shimi: 7 },
};

/** How much a subject's raw weight gets scaled by the student's own self-rating — weaker self-rating pulls more hours toward it. */
export const WEAKNESS_MULTIPLIER: Record<SelfRating, number> = {
  veryWeak: 1.5,
  weak: 1.3,
  medium: 1.0,
  good: 0.75,
};

/** Default estimated percent when the student skips the "چند درصد می‌زنی؟" slider — derived from self-rating alone. */
export const SELF_RATING_DEFAULT_PERCENT: Record<SelfRating, number> = {
  veryWeak: 15,
  weak: 30,
  medium: 50,
  good: 70,
};

/** Heuristic target percent per subject per goal tier, from real top-rank kārnāmeh patterns. */
export const TARGET_PERCENT_TABLE: Record<Track, Record<GoalTier, Partial<Record<SubjectKey, number>>>> = {
  tajrobi: {
    top200: { zist: 90, shimi: 88, fizik: 90, riazi: 85 },
    under1000: { zist: 82, shimi: 78, fizik: 78, riazi: 70 },
    under3000: { zist: 70, shimi: 62, fizik: 60, riazi: 55 },
    under8000: { zist: 55, shimi: 45, fizik: 42, riazi: 38 },
    anyField: { zist: 35, shimi: 30, fizik: 28, riazi: 25 },
  },
  riazi: {
    top200: { riazi: 95, fizik: 90, shimi: 85 },
    under1000: { riazi: 85, fizik: 78, shimi: 72 },
    under3000: { riazi: 70, fizik: 60, shimi: 55 },
    under8000: { riazi: 50, fizik: 42, shimi: 38 },
    anyField: { riazi: 30, fizik: 25, shimi: 22 },
  },
};

export const TEST_STUDY_RATIO: Record<Phase, { test: number; study: number }> = {
  paye: { test: 35, study: 65 },
  taghviat: { test: 50, study: 50 },
  jamBandiZoodras: { test: 65, study: 35 },
  jamBandiNahaei: { test: 80, study: 20 },
};

export const GOAL_TIER_LABEL: Record<GoalTier, string> = {
  anyField: "قبولی در هر رشته‌ای",
  under8000: "رتبه زیر ۸۰۰۰",
  under3000: "رتبه زیر ۳۰۰۰",
  under1000: "رتبه زیر ۱۰۰۰",
  top200: "جزو ۲۰۰ نفر برتر",
};

export const SELF_RATING_LABEL: Record<SelfRating, string> = {
  veryWeak: "خیلی ضعیف",
  weak: "ضعیف",
  medium: "متوسط",
  good: "خوب",
};

/** Track → Mentor.track / ExamTrackTabs' exact Persian string, for the Discover CTA handoff (see result/CtaSection.tsx). */
export const TRACK_LABEL_FA: Record<Track, string> = {
  tajrobi: "تجربی",
  riazi: "ریاضی",
};
