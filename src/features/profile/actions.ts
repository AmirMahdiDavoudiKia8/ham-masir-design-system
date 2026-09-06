"use server";

import { cookies } from "next/headers";
import { STUDENT_SESSION_COOKIE } from "@/lib/mentorPortal";

/**
 * The real, server-side half of "خروج از حساب" — deletes the httpOnly
 * session cookie that getSessionStudent() reads. Without this, logout only
 * ever cleared this device's local profileStore (a leftover from the old
 * phone+name scheme, before there was a real server session to invalidate),
 * so Home/Progress kept resolving the same account via the untouched
 * cookie — nobody could actually sign out. See ProfileActions.tsx for the
 * client-side stores this is paired with.
 */
export async function logoutStudent(): Promise<void> {
  const jar = await cookies();
  jar.delete(STUDENT_SESSION_COOKIE);
}
