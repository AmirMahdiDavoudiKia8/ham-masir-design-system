"use server";

import { ensureStudentSession, getSessionPhone } from "@/lib/mentorPortal";

/**
 * Fired the moment a subscription-plan payment succeeds (see PaymentForm) —
 * links this browser to a real, server-side student record and, if the
 * booked mentor has a mentor-portal account, adds the student to their
 * roster. See lib/mentorPortal.ts for what this does and doesn't guarantee.
 *
 * A server action's id ships in the client bundle and is directly callable
 * with any payload once known, bypassing PaymentForm entirely — so `phone`
 * can't be trusted as-is. ensureStudentSession both rewrites that phone's
 * PortalStudent record (mentor, plan) *and* repoints the caller's own
 * session cookie to it, which would otherwise let anyone who knows a
 * target's phone number silently take over their account. By the time this
 * fires, PhoneAuthGate has already set the session cookie for the real
 * caller (see /api/student-identity and its /login route) — trust that
 * instead of the client-supplied phone.
 */
export async function linkSubscriptionToPortal(name: string, phone: string, mentorId: string): Promise<void> {
  const sessionPhone = await getSessionPhone();
  if (!sessionPhone || sessionPhone !== phone) return;
  await ensureStudentSession(name, sessionPhone, mentorId);
}
