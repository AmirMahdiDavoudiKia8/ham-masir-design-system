"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logLead } from "@/lib/leads";
import { MENTOR_SESSION_COOKIE, registerMentorAccount } from "@/lib/mentorPortal";

export async function registerMentor(input: {
  name: string;
  phone: string;
  password: string;
}): Promise<{ error?: string }> {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const password = input.password;

  if (!name) return { error: "اسمت رو وارد کن." };
  if (!/^09\d{9}$/.test(phone)) return { error: "شماره موبایل معتبر نیست." };
  if (password.length < 4) return { error: "رمز باید حداقل ۴ کاراکتر باشه." };

  // Check-and-append happen together under one lock (see
  // registerMentorAccount) — two near-simultaneous registrations for the
  // same phone can't both pass a separate up-front check and silently
  // overwrite each other's account.
  const created = await registerMentorAccount({ id: phone, password, name, studentIds: [] });
  if (!created) return { error: "این شماره قبلاً ثبت‌نام کرده. از صفحه‌ی ورود وارد شو." };
  // Fire-and-forget — awaiting this made registration hang for however long
  // the Google Sheets call takes (observed up to ~15-20s from this VPS)
  // before the mentor ever saw a redirect. The account write above already
  // succeeded by this point; the lead log is a side record, not a gate.
  logLead("mentor_signup", { name, phone, password }).catch(() => {});
  const jar = await cookies();
  jar.set(MENTOR_SESSION_COOKIE, phone, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/mentor/portal/profile");
}
