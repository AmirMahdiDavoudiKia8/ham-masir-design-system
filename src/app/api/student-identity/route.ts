import { NextResponse } from "next/server";
import { setStudentSessionCookie } from "@/lib/mentorPortal";
import { isPhoneKnown, registerStudent } from "@/lib/studentIdentities";

/** Checked right after the phone step, before showing the name/password vs. password-only form — lets the client show "بساز" vs "وارد شو" copy without leaking anything else about the account. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone")?.trim();
  if (!phone) return NextResponse.json({ ok: false, error: "missing phone" }, { status: 400 });

  const known = await isPhoneKnown(phone);
  return NextResponse.json({ ok: true, known });
}

interface Payload {
  phone?: string;
  name?: string;
  password?: string;
}

/** Registration only — see /api/student-identity/login for signing an existing account in. */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const phone = body.phone?.trim();
  const name = body.name?.trim();
  const password = body.password;
  if (!phone || !name || !password) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const result = await registerStudent(phone, name, password);
  if (result.status === "exists") {
    return NextResponse.json({ ok: false, error: "exists" }, { status: 409 });
  }

  // Ties this browser to the same mentor-portal record this phone will ever
  // have (see lib/mentorPortal's ensureStudentSession) — set on every
  // successful auth, not just when a subscription is first booked, so
  // logging in on a second device picks up the same record instead of
  // silently falling back to the shared demo plan.
  await setStudentSessionCookie(phone);

  return NextResponse.json({ ok: true, status: result.status, name: result.name });
}
