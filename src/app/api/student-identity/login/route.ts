import { NextResponse } from "next/server";
import { setStudentSessionCookie } from "@/lib/mentorPortal";
import { findStudentByCredentials } from "@/lib/studentIdentities";

interface Payload {
  phone?: string;
  password?: string;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const phone = body.phone?.trim();
  const password = body.password;
  if (!phone || !password) return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });

  const account = await findStudentByCredentials(phone, password);
  if (!account) return NextResponse.json({ ok: false, error: "invalid credentials" }, { status: 401 });

  await setStudentSessionCookie(phone);
  return NextResponse.json({ ok: true, name: account.name });
}
