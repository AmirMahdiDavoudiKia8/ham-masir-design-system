"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findMentorByCredentials, isMentorProfileComplete, MENTOR_SESSION_COOKIE } from "@/lib/mentorPortal";

export async function loginMentor(phone: string, password: string): Promise<{ error?: string }> {
  const mentor = await findMentorByCredentials(phone.trim(), password.trim());
  if (!mentor) return { error: "شماره یا رمز اشتباهه، دوباره امتحان کن." };

  const jar = await cookies();
  jar.set(MENTOR_SESSION_COOKIE, mentor.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(
    mentor.catalogueId || isMentorProfileComplete(mentor) ? "/mentor/portal/students" : "/mentor/portal/profile",
  );
}

export async function logoutMentor(): Promise<void> {
  const jar = await cookies();
  jar.delete(MENTOR_SESSION_COOKIE);
  redirect("/mentor/portal/login");
}
