export type Track = "tajrobi" | "riazi";
export type GradeLevel = "dahom" | "yazdahom" | "davazdahom" | "farighotahsil";
export type SelfRating = "veryWeak" | "weak" | "medium" | "good";
export type StudyTimePref = "morning" | "afternoon" | "night";
export type StudyMode = "content" | "test" | "balanced";
export type GoalTier = "anyField" | "under8000" | "under3000" | "under1000" | "top200";
export type StudySeriousness = "justStarted" | "1to3m" | "3to6m" | "moreThan6m";
export type SubjectKey = "zist" | "shimi" | "fizik" | "riazi";

export interface SubjectInput {
  subjectKey: SubjectKey;
  selfRating: SelfRating;
  estimatedPercent?: number;
}

export interface PlannerFormData {
  grade: GradeLevel;
  track: Track;
  daysUntilExam: number;
  goalTier: GoalTier;
  interestedFields: string[];
  currentDailyHours: number;
  hasTakenMockExam: boolean;
  /** Years of mock-exam experience — collected as context, not fed into the engine's math (see engine.ts). */
  mockExamYears?: number;
  /** Rough average percent across all of the track's required subjects (see TRACK_SUBJECTS) — تجربی includes زیست, ریاضی doesn't since it has no زیست at all. Used by the engine as a better fallback than the flat self-rating default when a subject's own estimatedPercent is skipped (see computeAllocations). */
  mockExamAvgPercent?: number;
  studySeriousnessDuration: StudySeriousness;
  subjects: SubjectInput[];
  focusTime: StudyTimePref;
  mainChallenges: string[];
  currentStudyMode: StudyMode;
  name?: string;
}

/** Subjects the diagnostic asks about for a given track, in display order. Riazi has no zist — dropped entirely, not just zeroed (see engine.ts). زمین‌شناسی is intentionally not part of this feature at all. */
export const TRACK_SUBJECTS: Record<Track, SubjectKey[]> = {
  tajrobi: ["zist", "shimi", "fizik", "riazi"],
  riazi: ["riazi", "fizik", "shimi"],
};

export const SUBJECT_LABEL: Record<SubjectKey, string> = {
  zist: "زیست‌شناسی",
  shimi: "شیمی",
  fizik: "فیزیک",
  riazi: "ریاضی",
};

export type Phase = "paye" | "taghviat" | "jamBandiZoodras" | "jamBandiNahaei";

export const PHASE_LABEL: Record<Phase, string> = {
  paye: "فاز پایه",
  taghviat: "فاز تقویت",
  jamBandiZoodras: "جمع‌بندی زودرس",
  jamBandiNahaei: "جمع‌بندی نهایی",
};

export type ReasonTag = "weakHighWeight" | "onTrack" | "strongMaintain";

export interface SubjectAllocation {
  subjectKey: SubjectKey;
  label: string;
  weeklyHours: number;
  percentOfTotal: number;
  gapToTarget: number;
  currentPercent: number;
  targetPercent: number;
  reasonTag: ReasonTag;
}

export interface HourRampPoint {
  monthLabel: string;
  recommendedHours: number;
}

export interface PlannerResult {
  phase: Phase;
  daysLeft: number;
  weeklyTotalHours: number;
  subjectAllocations: SubjectAllocation[];
  hourRampCurve: HourRampPoint[];
  testToStudyRatio: { test: number; study: number };
  overallGapSummary: string;
  /** Average currentPercent across all of the track's subjects — the "سطح کلی" axis the level narrative and strength/weakness summary are banded on. */
  overallLevelPercent: number;
  /** Average gapToTarget across the same subjects — feeds the trend projection. */
  overallGapPercent: number;
}
