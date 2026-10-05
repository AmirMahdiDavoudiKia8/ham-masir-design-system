import { NextResponse } from "next/server";
import { getSessionPhone } from "@/lib/mentorPortal";
import { getStudentProfile, saveStudentProfile } from "@/lib/studentProfiles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone")?.trim();
  if (!phone) return NextResponse.json({ ok: false, error: "missing phone" }, { status: 400 });

  // Same guard as /api/student-bookings — a phone number is a guessable
  // 11-digit space, so this must only ever answer for the session's own phone.
  const sessionPhone = await getSessionPhone();
  if (!sessionPhone || sessionPhone !== phone) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const profile = await getStudentProfile(phone);
  return NextResponse.json({ ok: true, profile });
}

interface SavePayload {
  phone?: string;
  fieldOfStudy?: string;
  city?: string;
  stage?: string;
  goal?: string;
  need?: string;
  contact?: string;
}

export async function POST(request: Request) {
  let body: SavePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const phone = body.phone?.trim();
  if (!phone) return NextResponse.json({ ok: false, error: "missing phone" }, { status: 400 });

  const sessionPhone = await getSessionPhone();
  if (!sessionPhone || sessionPhone !== phone) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  await saveStudentProfile(phone, {
    fieldOfStudy: body.fieldOfStudy?.trim() ?? "",
    city: body.city?.trim() ?? "",
    stage: body.stage?.trim() ?? "",
    goal: body.goal?.trim() ?? "",
    need: body.need?.trim() ?? "",
    contact: body.contact?.trim() ?? "",
  });

  return NextResponse.json({ ok: true });
}
