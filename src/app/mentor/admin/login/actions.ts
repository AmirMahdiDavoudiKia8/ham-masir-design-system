"use server";

import { redirect } from "next/navigation";
import { setAdminSessionCookie, verifyAdminSecret } from "@/lib/adminAuth";

/**
 * Bound directly to a `<form action={loginAdmin}>` (see page.tsx). Always
 * redirects back to this *same* login page (with `next` preserved, plus
 * `error=1` on failure) rather than straight to the target admin page —
 * redirecting from inside a form action to an arbitrary *other* route
 * turned out unreliable in this Next.js version (observed hanging/looping
 * back to the login URL instead of navigating on). The login page itself
 * (see page.tsx) checks isAdminSession() on load and forwards to `next`
 * with a plain page-level redirect once the cookie this sets is actually
 * present — a redirect from a normal page load, not from inside a form
 * action, which is the pattern already proven reliable elsewhere in this
 * app (every /mentor/admin/* page's own auth redirect).
 */
export async function loginAdmin(formData: FormData): Promise<void> {
  const secret = String(formData.get("secret") ?? "").trim();
  const next = String(formData.get("next") ?? "/mentor/admin/analytics");

  if (!secret || !(await verifyAdminSecret(secret))) {
    redirect(`/mentor/admin/login?next=${encodeURIComponent(next)}&error=1`);
  }

  await setAdminSessionCookie(secret);
  redirect(`/mentor/admin/login?next=${encodeURIComponent(next)}`);
}
