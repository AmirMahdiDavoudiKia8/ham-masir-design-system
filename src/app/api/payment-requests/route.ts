import { NextResponse } from "next/server";
import { getSessionPhone } from "@/lib/mentorPortal";
import { createPaymentRequest } from "@/lib/paymentRequests";

interface CreatePayload {
  name?: string;
  phone?: string;
  mentorId?: string;
  mentorName?: string;
  planTitle?: string;
  slot?: string;
  price?: string;
}

/**
 * Creates a pending payment-request record once a student reaches the "pay
 * via bot" screen — the short code returned here is embedded in the
 * Telegram/Bale deep-link (`/start <code>`) so the bot can look the booking
 * details back up without the two systems sharing any other state.
 */
export async function POST(request: Request) {
  let body: CreatePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const { name, phone, mentorId, mentorName, planTitle, slot, price } = body;
  if (!name?.trim() || !phone?.trim() || !mentorId?.trim() || !mentorName?.trim() || !planTitle?.trim() || !slot?.trim()) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  // Identity (name<->phone) is verified upstream by PhoneAuthGate before this
  // screen is ever reached — but that's a client-side fact until it's also
  // checked here. Without this, anyone could flood the founder's manual
  // payment-review queue with fake reservation codes under a real student's
  // name/phone.
  const sessionPhone = await getSessionPhone();
  if (!sessionPhone || sessionPhone !== phone.trim()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const req = await createPaymentRequest({
    name: name.trim(),
    phone: phone.trim(),
    mentorId: mentorId.trim(),
    mentorName: mentorName.trim(),
    planTitle: planTitle.trim(),
    slot: slot.trim(),
    price: price?.trim() || undefined,
  });

  return NextResponse.json({ ok: true, code: req.code });
}
