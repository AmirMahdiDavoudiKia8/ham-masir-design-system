import { NextResponse } from "next/server";
import type { PushSubscription } from "web-push";
import { isAdminSession } from "@/lib/adminAuth";
import { sendAdminPush } from "@/lib/adminNotify";
import { addSubscription } from "@/lib/pushSubscriptions";

/**
 * Registers the calling device for founder notifications (see adminNotify),
 * then immediately sends one test push to it — so "turned on" is proven by a
 * notification actually arriving, not just by the permission prompt passing.
 *
 * Admin-only: anyone who could register here would receive every student's
 * name and phone number on each signup.
 */
export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { subscription?: PushSubscription; test?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  if (body.subscription) {
    const sub = body.subscription;
    if (typeof sub.endpoint !== "string" || !sub.endpoint.startsWith("https://") || !sub.keys?.p256dh || !sub.keys?.auth) {
      return NextResponse.json({ ok: false, error: "invalid subscription" }, { status: 400 });
    }
    await addSubscription(
      { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } },
      request.headers.get("user-agent") ?? undefined,
    );
  }

  const delivered = await sendAdminPush("🔔 نوتیف هم‌مسیر فعاله", "از این به بعد هر ثبت‌نام، رزرو و لغو همین‌جا خبرت می‌کنه.");
  return NextResponse.json({ ok: true, delivered });
}
