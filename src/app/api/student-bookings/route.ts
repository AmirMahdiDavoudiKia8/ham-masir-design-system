import { NextResponse } from "next/server";
import { getSessionPhone } from "@/lib/mentorPortal";
import { addStudentBooking, getStudentBookings } from "@/lib/studentBookings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone")?.trim();
  if (!phone) return NextResponse.json({ ok: false, error: "missing phone" }, { status: 400 });

  // A phone number is an 11-digit guessable space — without this, anyone
  // could read any real student's mentor/plan/price/booking-time history
  // just by passing their number here. Every legitimate caller (see
  // ProfileHome, PaymentForm) already has the session cookie set to this
  // exact phone by the time it calls this route.
  const sessionPhone = await getSessionPhone();
  if (!sessionPhone || sessionPhone !== phone) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const bookings = await getStudentBookings(phone);
  return NextResponse.json({ ok: true, bookings });
}

interface CreatePayload {
  phone?: string;
  mentorId?: string;
  plan?: "session" | "subscription";
  planTitle?: string;
  slot?: string;
  price?: string;
  status?: "upcoming" | "active";
}

export async function POST(request: Request) {
  let body: CreatePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const { phone, mentorId, plan, planTitle, slot, price, status } = body;
  if (!phone?.trim() || !mentorId?.trim() || !plan || !planTitle?.trim() || !slot?.trim() || !status) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const sessionPhone = await getSessionPhone();
  if (!sessionPhone || sessionPhone !== phone.trim()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const booking = await addStudentBooking(phone.trim(), {
    mentorId: mentorId.trim(),
    plan,
    planTitle: planTitle.trim(),
    slot: slot.trim(),
    price: price?.trim() || undefined,
    status,
  });

  return NextResponse.json({ ok: true, booking });
}
