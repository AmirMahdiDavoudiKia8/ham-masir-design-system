import { readFile } from "node:fs/promises";
import path from "node:path";

export type TaskType = "درسنامه" | "تست";

/** Every field but `id` optional — same degrade-gracefully contract as Mentor/Booking. */
export interface Task {
  id: string;
  subject?: string;
  topic?: string;
  type?: TaskType;
  target?: string;
  done: boolean;
}

export interface PlanDay {
  dayLabel?: string;
  /** Persian numerals, e.g. "۱۲ اردیبهشت" */
  dateLabel?: string;
  isToday?: boolean;
  tasks: Task[];
}

export interface StudyPlan {
  weekLabel?: string;
  days: PlanDay[];
}

export type CalendarDayStatus = "complete" | "partial" | "missed" | "today" | "rest";

export interface CalendarDay {
  day: number;
  /** Absent = no data yet (e.g. a day later this month) — renders as a quiet neutral cell. */
  status?: CalendarDayStatus;
}

export interface MonthCalendar {
  monthLabel?: string;
  /** 0 = شنبه ... 6 = جمعه — which column day 1 falls in. */
  startWeekday: number;
  /** Which `day` is "today" — its cell is always computed live from the checklist, never from `status`. */
  todayDay?: number;
  days: CalendarDay[];
}

export interface ProgressData {
  studyPlan: StudyPlan;
  monthCalendar: MonthCalendar;
}

const PROGRESS_FILE = path.join(process.cwd(), "src/data/progress/progress.json");

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function bool(value: unknown): boolean {
  return value === true;
}

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function taskType(value: unknown): TaskType | undefined {
  return value === "درسنامه" || value === "تست" ? value : undefined;
}

function calendarStatus(value: unknown): CalendarDayStatus | undefined {
  return value === "complete" ||
    value === "partial" ||
    value === "missed" ||
    value === "today" ||
    value === "rest"
    ? value
    : undefined;
}

function normalizeTask(raw: unknown, fallbackId: string): Task | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  return {
    id: str(r.id) ?? fallbackId,
    subject: str(r.subject),
    topic: str(r.topic),
    type: taskType(r.type),
    target: str(r.target),
    done: bool(r.done),
  };
}

function normalizeDay(raw: unknown, fallbackIndex: number): PlanDay | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const rawTasks = Array.isArray(r.tasks) ? r.tasks : [];
  return {
    dayLabel: str(r.dayLabel),
    dateLabel: str(r.dateLabel),
    isToday: bool(r.isToday),
    tasks: rawTasks
      .map((t, i) => normalizeTask(t, `day${fallbackIndex}-task${i}`))
      .filter((t): t is Task => t !== null),
  };
}

function normalizeCalendarDay(raw: unknown): CalendarDay | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const day = num(r.day);
  if (day === undefined) return null;
  return { day, status: calendarStatus(r.status) };
}

/**
 * Reads the student's weekly study plan + month calendar from local static
 * data — no backend yet. Never throws: any read/parse failure degrades to
 * empty structures so the screen can render its own graceful fallbacks
 * instead of crashing.
 */
export async function getProgressData(): Promise<ProgressData> {
  const empty: ProgressData = {
    studyPlan: { days: [] },
    monthCalendar: { startWeekday: 0, days: [] },
  };

  try {
    const raw = JSON.parse(await readFile(PROGRESS_FILE, "utf-8"));
    if (!raw || typeof raw !== "object") return empty;
    const r = raw as Record<string, unknown>;

    const rawPlan = (r.studyPlan ?? {}) as Record<string, unknown>;
    const rawDays = Array.isArray(rawPlan.days) ? rawPlan.days : [];
    const studyPlan: StudyPlan = {
      weekLabel: str(rawPlan.weekLabel),
      days: rawDays.map((d, i) => normalizeDay(d, i)).filter((d): d is PlanDay => d !== null),
    };

    const rawCal = (r.monthCalendar ?? {}) as Record<string, unknown>;
    const rawCalDays = Array.isArray(rawCal.days) ? rawCal.days : [];
    const monthCalendar: MonthCalendar = {
      monthLabel: str(rawCal.monthLabel),
      startWeekday: num(rawCal.startWeekday) ?? 0,
      todayDay: num(rawCal.todayDay),
      days: rawCalDays.map(normalizeCalendarDay).filter((d): d is CalendarDay => d !== null),
    };

    return { studyPlan, monthCalendar };
  } catch {
    return empty;
  }
}
