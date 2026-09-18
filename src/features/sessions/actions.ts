"use server";

import { revalidatePath } from "next/cache";
import { logLead } from "@/lib/leads";
import { getSessionPhone, updateStudent } from "@/lib/mentorPortal";
import type { PlanKey } from "@/lib/plans";
import { cancelStudentBooking } from "@/lib/studentBookings";

/** Cancels the logged-in student's subscription relationship with their mentor. No money is involved: nothing is charged before a session happens (see components/brand/PayAfterPromise), which is why the confirm sheet no longer states a refund policy. */
export async function cancelSession(reason: string): Promise<{ error?: string }> {
  const phone = await getSessionPhone();
  if (!phone) return { error: "برای لغو باید دوباره وارد حسابت بشی." };

  const updated = await updateStudent(phone, (student) => ({
    ...student,
    cancelled: { by: "student", reason: reason.trim() || undefined, at: new Date().toISOString() },
  }));
  if (!updated) return { error: "برنامه‌ای برای لغو پیدا نشد." };

  revalidatePath("/student/home");
  revalidatePath("/student/progress");
  revalidatePath(`/mentor/portal/students/${updated.id}`);
  revalidatePath("/mentor/portal/students");

  logLead("cancellation", {
    by: "student",
    studentName: updated.name,
    studentPhone: updated.phone,
    reason: reason.trim(),
  }).catch(() => {});

  return {};
}

/**
 * Cancels one specific one-off "session" (trial) booking — unlike
 * cancelSession above, which cancels the whole subscription relationship, a
 * student can have several of these with different mentors, so this targets
 * one by mentorId+plan+slot (see cancelStudentBooking for why not by id).
 * Requires a live session cookie (see getSessionPhone) so a booking can only
 * ever be cancelled by the phone that made it.
 */
export async function cancelBooking(mentorId: string, plan: PlanKey, slot: string): Promise<{ error?: string }> {
  const phone = await getSessionPhone();
  if (!phone) return { error: "برای لغو باید دوباره وارد حسابت بشی." };

  const updated = await cancelStudentBooking(phone, mentorId, plan, slot);
  if (!updated) return { error: "این جلسه پیدا نشد." };

  revalidatePath("/student/home");
  return {};
}
