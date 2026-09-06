import {
  BASE_WEIGHTS,
  SELF_RATING_DEFAULT_PERCENT,
  TARGET_PERCENT_TABLE,
  TEST_STUDY_RATIO,
  WEAKNESS_MULTIPLIER,
} from "./constants";
import {
  type GradeLevel,
  type HourRampPoint,
  type Phase,
  type PlannerFormData,
  type PlannerResult,
  type ReasonTag,
  type SelfRating,
  type SubjectAllocation,
  SUBJECT_LABEL,
  TRACK_SUBJECTS,
} from "./types";

/** Rounds to the nearest 0.5 — every hour figure in this engine is displayed/scheduled in half-hour steps. */
function roundHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

/**
 * Konkur day has landed on ~July 1st in recent years; used only as a
 * placeholder default when the student doesn't know exactly how many days
 * are left (Step 1's "نمی‌دونم" button) — returns a day count directly
 * rather than a date, since the form itself now asks for days, not a
 * calendar date. davazdahom/farighotahsil sit for the next upcoming one;
 * yazdahom/dahom are 1/2 years further out respectively.
 */
export function guessDaysUntilExam(grade: GradeLevel, today: Date = new Date()): number {
  const KONKUR_MONTH_INDEX = 6; // July, 0-based
  const yearsUntil: Record<GradeLevel, number> = {
    davazdahom: 0,
    farighotahsil: 0,
    yazdahom: 1,
    dahom: 2,
  };
  let targetYear = today.getFullYear();
  if (today.getMonth() > KONKUR_MONTH_INDEX) targetYear += 1;
  targetYear += yearsUntil[grade];
  const target = new Date(targetYear, KONKUR_MONTH_INDEX, 1);
  target.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

function getPhase(daysLeft: number): Phase {
  if (daysLeft > 180) return "paye";
  if (daysLeft > 90) return "taghviat";
  if (daysLeft > 30) return "jamBandiZoodras";
  return "jamBandiNahaei";
}

/**
 * Pushes any subject's share above a 10% floor (so nothing gets starved to
 * near-zero), redistributing the deficit proportionally from the
 * not-yet-floored subjects. Small fixed subject counts (3-4) converge in at
 * most one pass per subject.
 */
function enforceFloor(shares: Record<string, number>): Record<string, number> {
  const FLOOR = 0.1;
  const keys = Object.keys(shares);
  const result = { ...shares };
  const floored = new Set<string>();

  for (let pass = 0; pass < keys.length; pass++) {
    let deficit = 0;
    for (const key of keys) {
      if (floored.has(key)) continue;
      if (result[key] < FLOOR) {
        deficit += FLOOR - result[key];
        result[key] = FLOOR;
        floored.add(key);
      }
    }
    if (deficit <= 0) break;
    const reducible = keys.filter((k) => !floored.has(k));
    const reducibleTotal = reducible.reduce((sum, k) => sum + result[k], 0);
    if (reducibleTotal <= 0) break;
    for (const key of reducible) {
      result[key] -= deficit * (result[key] / reducibleTotal);
    }
  }
  return result;
}

function computeAllocations(formData: PlannerFormData, weeklyTotalHours: number): SubjectAllocation[] {
  const track = formData.track;
  const subjectKeys = TRACK_SUBJECTS[track];
  const baseWeights = BASE_WEIGHTS[track];
  const targets = TARGET_PERCENT_TABLE[track][formData.goalTier];
  const inputBySubject = new Map(formData.subjects.map((s) => [s.subjectKey, s]));

  const rawWeights: Record<string, number> = {};
  for (const key of subjectKeys) {
    const rating: SelfRating = inputBySubject.get(key)?.selfRating ?? "medium";
    rawWeights[key] = (baseWeights[key] ?? 0) * WEAKNESS_MULTIPLIER[rating];
  }
  const totalRaw = Object.values(rawWeights).reduce((a, b) => a + b, 0) || 1;
  const rawShares: Record<string, number> = {};
  for (const key of subjectKeys) rawShares[key] = rawWeights[key] / totalRaw;

  const shares = enforceFloor(rawShares);

  return subjectKeys.map((key) => {
    const input = inputBySubject.get(key);
    const rating: SelfRating = input?.selfRating ?? "medium";
    // A real mock-exam average across the track's subjects is better signal
    // than the flat self-rating default, so it takes priority over that
    // fallback (but never over the student's own per-subject estimate, when
    // given) — see mockExamAvgPercent's doc comment in types.ts for which
    // subjects this question actually covers per track.
    const fallbackPercent = formData.mockExamAvgPercent ?? SELF_RATING_DEFAULT_PERCENT[rating];
    const currentPercent = input?.estimatedPercent ?? fallbackPercent;
    const targetPercent = targets[key] ?? 50;
    const gap = targetPercent - currentPercent;
    const base = baseWeights[key] ?? 0;
    const weeklyHours = roundHalf(shares[key] * weeklyTotalHours);

    let reasonTag: ReasonTag;
    if (gap > 25 && base >= 9) reasonTag = "weakHighWeight";
    else if (gap <= 5) reasonTag = "onTrack";
    else if (rating === "good" && gap <= 0) reasonTag = "strongMaintain";
    else reasonTag = "onTrack";

    return {
      subjectKey: key,
      label: SUBJECT_LABEL[key],
      weeklyHours,
      percentOfTotal: Math.round(shares[key] * 1000) / 10,
      gapToTarget: gap,
      currentPercent,
      targetPercent,
      reasonTag,
    };
  });
}

/** Month-by-month recommended daily hours from now to exam day, capped for readability at 12 points. */
function buildHourRampCurve(currentDailyHours: number, daysLeft: number): HourRampPoint[] {
  const months = Math.min(12, Math.max(2, Math.ceil(daysLeft / 30)));
  const slowRamp = currentDailyHours >= 10;
  const monthlyIncrement = slowRamp ? 0.5 : 1.25;

  const points: HourRampPoint[] = [{ monthLabel: "الان", recommendedHours: roundHalf(currentDailyHours) }];
  let hours = currentDailyHours;
  for (let m = 1; m < months; m++) {
    hours += monthlyIncrement;
    const daysLeftAtMonth = daysLeft - m * 30;
    const isFinalStretch = m === months - 1 && daysLeftAtMonth < 30;
    const cap = isFinalStretch ? 14 : 12;
    hours = Math.min(hours, cap);
    points.push({ monthLabel: `ماه ${m}`, recommendedHours: roundHalf(hours) });
  }
  return points;
}

/** Averages currentPercent/gapToTarget across all of the track's subjects into the two composite scores the level narrative, strength/weakness card, and trend projection are banded on. */
function computeOverallStats(allocations: SubjectAllocation[]): { overallLevelPercent: number; overallGapPercent: number } {
  const overallLevelPercent = Math.round(allocations.reduce((sum, a) => sum + a.currentPercent, 0) / allocations.length);
  const overallGapPercent = Math.round(allocations.reduce((sum, a) => sum + a.gapToTarget, 0) / allocations.length);
  return { overallLevelPercent, overallGapPercent };
}

function buildSummary(formData: PlannerFormData, allocations: SubjectAllocation[], phase: Phase): string {
  if (phase === "jamBandiNahaei") {
    return "با روزهای باقی‌مونده، وقتِ جمع‌بندیه — چیز جدید یاد نگیر، فقط مرور کن و تست بزن.";
  }
  const startMsg = formData.currentDailyHours === 0 ? "شروع از صفر یعنی الان بهترین زمان برای شروعه. " : "";
  const topPriority = [...allocations].sort((a, b) => b.gapToTarget - a.gapToTarget)[0];
  const growthMsg = topPriority
    ? `${topPriority.label} جایی‌ست که بیشترین فرصت رشد رو داری — بیشترین وقتت رو همون‌جا گذاشتیم.`
    : "";
  return `${startMsg}${growthMsg}`;
}

/**
 * Pure diagnostic engine — no UI, no side effects. Given the form answers,
 * computes the full study-hour allocation and hour ramp shown on the result
 * page. See section 5 of the planner spec for the formulas this implements.
 */
export function computePlannerResult(formData: PlannerFormData): PlannerResult {
  const daysLeft = Math.max(1, Math.round(formData.daysUntilExam));
  const phase = getPhase(daysLeft);
  // A student starting from literally zero hours gets a gentler week-one
  // number instead of the raw 0 (which would zero out every subject's
  // allocation and render an empty plan) — see spec section 9.
  const effectiveDailyHours = formData.currentDailyHours === 0 ? 2 : formData.currentDailyHours;
  const weeklyTotalHours = effectiveDailyHours * 7;

  const subjectAllocations = computeAllocations(formData, weeklyTotalHours);
  const hourRampCurve = buildHourRampCurve(formData.currentDailyHours, daysLeft);
  const testToStudyRatio = TEST_STUDY_RATIO[phase];
  const overallGapSummary = buildSummary(formData, subjectAllocations, phase);
  const { overallLevelPercent, overallGapPercent } = computeOverallStats(subjectAllocations);

  return {
    phase,
    daysLeft,
    weeklyTotalHours,
    subjectAllocations,
    hourRampCurve,
    testToStudyRatio,
    overallGapSummary,
    overallLevelPercent,
    overallGapPercent,
  };
}
