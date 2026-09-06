"use server";

import { revalidatePath } from "next/cache";
import { logLead } from "@/lib/leads";
import type { PlanDay } from "@/lib/progress";
import { getSessionMentor, updateStudent } from "@/lib/mentorPortal";

/** Every write here re-checks the session mentor actually owns this student — the id in the URL is not enough on its own. */
async function assertOwnership(studentId: string) {
  const mentor = await getSessionMentor();
  if (!mentor || !mentor.studentIds.includes(studentId)) {
    throw new Error("دسترسی نداری.");
  }
}

/**
 * Saves the plan's *structure* (week label, day labels/dates, which tasks
 * exist and their subject/topic/type/target) — never `done` state. The
 * `days` this receives is whatever the mentor's browser had in memory since
 * the page loaded, which can be stale by the time "ذخیره برنامه" is
 * pressed: the student may have ticked a task in between via the
 * auto-syncing student-side toggle (see /student/progress/actions.ts), or
 * the mentor herself may have ticked one via toggleStudentTaskAsMentor
 * below. Writing the client's `done` values here would silently revert
 * either of those. Existing tasks keep whatever `done` is currently live on
 * the server; only a brand-new task (no matching id server-side yet) uses
 * the client's value, which is always `false` fresh out of newTask(). The
 * "current done" read happens inside the same lock as the write (see
 * updateStudent), so there's no window for a concurrent toggle to land
 * between reading it and writing it back.
 */
export async function saveStudentPlan(studentId: string, weekLabel: string, days: PlanDay[]): Promise<void> {
  await assertOwnership(studentId);

  const updated = await updateStudent(studentId, (student) => {
    const currentDoneById = new Map<string, boolean>();
    for (const day of student.days) {
      for (const task of day.tasks) currentDoneById.set(task.id, task.done);
    }
    const daysWithPreservedDone = days.map((day) => ({
      ...day,
      tasks: day.tasks.map((task) => ({ ...task, done: currentDoneById.get(task.id) ?? task.done })),
    }));
    return { ...student, weekLabel: weekLabel.trim() || undefined, days: daysWithPreservedDone };
  });
  if (!updated) throw new Error("دانش‌آموز پیدا نشد.");

  revalidatePath(`/mentor/portal/students/${studentId}`);
}

/** Writes a single task's `done` flip straight to the server, the same instant the mentor taps it in the "پیشرفت" checklist — mirrors the student-side toggleStudentTask (see /student/progress/actions.ts) so neither side's tick can be silently reverted by the other's next bulk plan save. */
export async function toggleStudentTaskAsMentor(studentId: string, taskId: string): Promise<void> {
  await assertOwnership(studentId);

  const updated = await updateStudent(studentId, (student) => ({
    ...student,
    days: student.days.map((day) => ({
      ...day,
      tasks: day.tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)),
    })),
  }));
  if (!updated) return;

  revalidatePath(`/mentor/portal/students/${studentId}`);
  revalidatePath("/student/progress");
}

export async function saveStudentSessions(studentId: string, sessions: string[]): Promise<void> {
  await assertOwnership(studentId);

  const updated = await updateStudent(studentId, (student) => ({
    ...student,
    sessions: sessions.map((s) => s.trim()).filter(Boolean),
  }));
  if (!updated) throw new Error("دانش‌آموز پیدا نشد.");

  revalidatePath(`/mentor/portal/students/${studentId}`);
}

export async function saveStudentMeetLink(studentId: string, meetLink: string): Promise<{ error?: string }> {
  await assertOwnership(studentId);
  const trimmed = meetLink.trim();
  if (trimmed && !/^https:\/\/meet\.google\.com\//.test(trimmed)) {
    return { error: "باید یه لینک گوگل‌میت معتبر باشه (با https://meet.google.com/ شروع بشه)." };
  }

  const updated = await updateStudent(studentId, (student) => ({ ...student, meetLink: trimmed || undefined }));
  if (!updated) return { error: "دانش‌آموز پیدا نشد." };

  revalidatePath(`/mentor/portal/students/${studentId}`);
  revalidatePath("/student/home");
  return {};
}

/** The founder must be coordinated with directly before this is pressed (see the warning text next to the button) — so, unlike the student-side cancellation, no reason is collected here. */
export async function cancelStudent(studentId: string): Promise<{ error?: string }> {
  await assertOwnership(studentId);
  const mentor = await getSessionMentor();
  if (!mentor) return { error: "دانش‌آموز پیدا نشد." };

  const updated = await updateStudent(studentId, (student) => ({
    ...student,
    cancelled: { by: "mentor", at: new Date().toISOString() },
  }));
  if (!updated) return { error: "دانش‌آموز پیدا نشد." };

  revalidatePath(`/mentor/portal/students/${studentId}`);
  revalidatePath("/mentor/portal/students");
  revalidatePath("/student/home");
  revalidatePath("/student/progress");

  logLead("cancellation", {
    by: "mentor",
    studentName: updated.name,
    studentPhone: updated.phone,
    mentorName: mentor.name,
    mentorPhone: mentor.id,
  }).catch(() => {});

  return {};
}
