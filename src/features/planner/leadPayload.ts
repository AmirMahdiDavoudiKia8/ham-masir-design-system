import type { PlannerFormData } from "./types";

/**
 * Flattens the full form answer set into the string-only shape /api/leads
 * expects. Shared by PlannerFlow (logged the moment the form is finished,
 * before the student ever sees a phone-number prompt — so a session that
 * never reaches the CTA still leaves a record) and CtaSection (logged again
 * alongside the phone number, so that one record is a complete, self-
 * contained lead instead of a phone-only fragment an admin can't connect
 * back to the rest of the answers).
 */
export function buildPlannerLeadPayload(data: PlannerFormData, extra: Record<string, string> = {}): Record<string, string> {
  return {
    grade: data.grade,
    track: data.track,
    daysUntilExam: String(data.daysUntilExam),
    goalTier: data.goalTier,
    interestedFields: data.interestedFields.join(", "),
    currentDailyHours: String(data.currentDailyHours),
    hasTakenMockExam: String(data.hasTakenMockExam),
    mockExamYears: data.mockExamYears !== undefined ? String(data.mockExamYears) : "",
    mockExamAvgPercent: data.mockExamAvgPercent !== undefined ? String(data.mockExamAvgPercent) : "",
    studySeriousnessDuration: data.studySeriousnessDuration,
    subjects: JSON.stringify(data.subjects),
    focusTime: data.focusTime,
    mainChallenges: data.mainChallenges.join(", "),
    currentStudyMode: data.currentStudyMode,
    name: data.name ?? "",
    ...extra,
  };
}
