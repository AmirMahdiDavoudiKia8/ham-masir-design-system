"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CancellationInfo } from "@/lib/mentorPortal";
import type { Mentor } from "@/lib/mentors";
import type { MonthCalendar as MonthCalendarData, StudyPlan } from "@/lib/progress";
import { planDayNumber, resolveSessionDay } from "@/lib/sessionDay";
import { toggleStudentTask } from "@/app/student/(app)/progress/actions";
import { useBookingsStore } from "@/store/bookingsStore";
import { useProgressStore } from "@/store/progressStore";
import { useLivePlan } from "../useLivePlan";
import { MissedDaysNudge } from "./MissedDaysNudge";
import { MonthCalendar } from "./MonthCalendar";
import { ProgressCancelledState } from "./ProgressCancelledState";
import { ProgressEmptyState } from "./ProgressEmptyState";
import { SelectedDayPanel } from "./SelectedDayPanel";
import { WeeklyChecklist } from "./WeeklyChecklist";

interface ProgressHomeProps {
  studyPlan: StudyPlan;
  monthCalendar: MonthCalendarData;
  /** Canonical mentor list, fetched server-side — the subscribed mentor is resolved against this by id. */
  mentors: Mentor[];
  /** Present only when this browser is linked to a real, server-side student record (see lib/mentorPortal.ts) — ticks also persist there so the mentor sees them, not just localStorage. */
  studentId?: string;
  /** Set once either side cancels the subscription relationship — see lib/mentorPortal.ts. Takes priority over the normal plan view even if a stale booking is still sitting in the local bookingsStore. */
  cancelled?: CancellationInfo;
  /** Server-resolved mentor name (see PortalStudent.mentorId) — the fallback for the "این برنامه رو … برات چیده" attribution line when no local booking for this subscription exists in this browser (e.g. it was made on another device). */
  serverMentorName?: string;
}

/** Task-done state lives in the persisted progress store (ticking survives a reload); the plan/calendar structure itself is still local static data, unless `studentId` is set, in which case it's the mentor-written plan and ticks also sync server-side. The ring and today's calendar cell are both derived from the same store, so they always agree with the checklist. */
export function ProgressHome({ studyPlan, monthCalendar, mentors, studentId, cancelled, serverMentorName }: ProgressHomeProps) {
  const router = useRouter();
  const doneOverrides = useProgressStore((s) => s.doneOverrides);
  const toggleTask = useProgressStore((s) => s.toggleTask);
  const bookings = useBookingsStore((s) => s.bookings);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

  // A plan the mentor edits mid-call should land here without the student
  // being told to refresh. Only for a server-linked student — see useLivePlan.
  useLivePlan(Boolean(studentId), pendingTaskId !== null);

  const defaultDoneById = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const day of studyPlan.days) {
      for (const task of day.tasks) map.set(task.id, task.done);
    }
    return map;
  }, [studyPlan]);

  // For a server-linked student (studentId set), `doneOverrides` is never
  // consulted — it's a *local-only* override, so once the mentor also ticks
  // that same task from their side (a real, supported action — see
  // StudentPlanEditor's own checklist), the student's cached override would
  // silently disagree with the server forever, and each side's next tap
  // would flip the *other* side's value instead of their own, permanently
  // inverting who sees what as "done". Server truth (studyPlan, refetched
  // after every toggle below) is the only source of truth here; the local
  // override model still applies to the no-`studentId` demo plan, which has
  // no server counterpart to drift out of sync with.
  function isTaskDone(taskId: string): boolean {
    if (studentId) return defaultDoneById.get(taskId) ?? false;
    return doneOverrides[taskId] ?? defaultDoneById.get(taskId) ?? false;
  }

  function handleToggle(taskId: string) {
    if (studentId) {
      setPendingTaskId(taskId);
      toggleStudentTask(taskId)
        .then(() => router.refresh())
        .catch(() => {})
        .finally(() => setPendingTaskId(null));
      return;
    }
    toggleTask(taskId, isTaskDone(taskId));
  }

  const days = useMemo(
    () =>
      studyPlan.days.map((day) => ({
        ...day,
        tasks: day.tasks.map((task) => ({ ...task, done: isTaskDone(task.id) })),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [studyPlan, doneOverrides],
  );

  const todayPlanDay = days.find((d) => d.isToday);
  const todayLiveStatus: "empty" | "partial" | "complete" =
    !todayPlanDay || todayPlanDay.tasks.length === 0
      ? "empty"
      : todayPlanDay.tasks.every((t) => t.done)
        ? "complete"
        : todayPlanDay.tasks.some((t) => t.done)
          ? "partial"
          : "empty";

  const hasRecentMiss = monthCalendar.days.some(
    (d) => d.status === "missed" && monthCalendar.todayDay !== undefined && d.day < monthCalendar.todayDay,
  );

  // Which calendar day-of-month each week-plan day falls on, both directions —
  // used to (a) show a clicked day's real task list when it's within this
  // week, and (b) translate a booking's weekday-name slot into a day number.
  const dayNumberToPlanDay = useMemo(() => {
    const map = new Map<number, (typeof days)[number]>();
    for (const day of days) {
      const num = planDayNumber(day);
      if (num !== undefined) map.set(num, day);
    }
    return map;
  }, [days]);

  const weekdayNameToDay = useMemo(() => {
    const map: Record<string, number> = {};
    for (const day of studyPlan.days) {
      const num = planDayNumber(day);
      if (day.dayLabel && num !== undefined) map[day.dayLabel] = num;
    }
    return map;
  }, [studyPlan]);

  // Best-effort: which calendar days have a mentor session, resolved from
  // the student's real bookings (see resolveSessionDay for the caveats).
  const sessionDays = useMemo(() => {
    if (monthCalendar.todayDay === undefined) return new Set<number>();
    const resolved = bookings
      .map((b) => resolveSessionDay(b.slot, monthCalendar.todayDay!, weekdayNameToDay))
      .filter((d): d is number => d !== undefined);
    return new Set(resolved);
  }, [bookings, monthCalendar.todayDay, weekdayNameToDay]);

  // The plan is only ever attributed to a mentor the student actually
  // subscribed to. `serverMentorName` (resolved from PortalStudent.mentorId)
  // takes priority since it's authoritative for any device; the local
  // booking is only a fallback for the rare case a student's phone number
  // never made it into a session cookie (shouldn't happen post-login, but
  // costs nothing to keep as a second source).
  const subscriptionBooking = [...bookings].reverse().find((b) => b.plan === "subscription");
  const mentorName = serverMentorName ?? mentors.find((m) => m.id === subscriptionBooking?.mentorId)?.name;
  // `studentId` is only ever set once this phone has a real, server-side
  // PortalStudent record (see lib/mentorPortal.ts) — i.e. a real plan is
  // already sitting in `studyPlan` regardless of what the local
  // bookingsStore does or doesn't know about. Relying on `subscriptionBooking`
  // alone meant a student who subscribed on a different device (or cleared
  // this browser's storage) saw "هنوز برنامه‌ای برات چیده نشده" despite her
  // mentor having already written her a real weekly plan.
  const hasRealSession = Boolean(studentId) || Boolean(subscriptionBooking);

  if (cancelled) {
    return <ProgressCancelledState cancelled={cancelled} mentorName={mentorName} />;
  }
  if (!hasRealSession) {
    return <ProgressEmptyState />;
  }

  const selectedPlanDay = selectedDay !== null ? dayNumberToPlanDay.get(selectedDay) : undefined;
  const selectedStatus = selectedDay !== null ? monthCalendar.days.find((d) => d.day === selectedDay)?.status : undefined;
  const selectedIsFuture =
    selectedDay !== null && monthCalendar.todayDay !== undefined && selectedDay > monthCalendar.todayDay;

  return (
    <div className="flex flex-col gap-6">
      <MonthCalendar
        monthLabel={monthCalendar.monthLabel}
        startWeekday={monthCalendar.startWeekday}
        days={monthCalendar.days}
        todayDay={monthCalendar.todayDay}
        todayLiveStatus={todayLiveStatus}
        sessionDays={sessionDays}
        selectedDay={selectedDay}
        onSelectDay={(day) => setSelectedDay((prev) => (prev === day ? null : day))}
      />

      {selectedDay !== null && (
        <SelectedDayPanel
          day={selectedDay}
          planDay={selectedPlanDay}
          status={selectedStatus}
          isFuture={selectedIsFuture}
          onToggleTask={handleToggle}
          onClose={() => setSelectedDay(null)}
          pendingTaskId={pendingTaskId}
        />
      )}

      {mentorName && (
        <p className="text-center text-caption text-muted-foreground">این برنامه رو {mentorName} برات چیده.</p>
      )}

      <WeeklyChecklist weekLabel={studyPlan.weekLabel} days={days} onToggleTask={handleToggle} pendingTaskId={pendingTaskId} />

      {hasRecentMiss && <MissedDaysNudge />}
    </div>
  );
}
