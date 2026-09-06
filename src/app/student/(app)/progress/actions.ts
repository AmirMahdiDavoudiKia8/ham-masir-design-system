"use server";

import { revalidatePath } from "next/cache";
import { getSessionPhone, updateStudent } from "@/lib/mentorPortal";

/**
 * Persists a task tick server-side so the mentor sees it too (not just this
 * browser's localStorage). A no-op if this browser has no linked student
 * record yet (e.g. the shared demo plan, or a session-plan booking) — the
 * caller's local optimistic toggle still handles that case visually.
 * Read-modify-write happens atomically inside updateStudent (see
 * lib/mentorPortal.ts) so this can never silently clobber (or be clobbered
 * by) toggleStudentTaskAsMentor's own toggle of the same task.
 */
export async function toggleStudentTask(taskId: string): Promise<void> {
  const phone = await getSessionPhone();
  if (!phone) return;

  const updated = await updateStudent(phone, (student) => ({
    ...student,
    days: student.days.map((day) => ({
      ...day,
      tasks: day.tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)),
    })),
  }));
  if (!updated) return;

  revalidatePath("/student/progress");
  revalidatePath(`/mentor/portal/students/${updated.id}`);
}
