import { NextResponse } from "next/server";
import { getPaymentRequest } from "@/lib/paymentRequests";

/** Shared secret the Telegram/Bale bot processes send as `Authorization: Bearer <secret>` — set BOT_API_SECRET in .env.local and give the bots the same value. */
function isAuthorized(request: Request): boolean {
  const secret = process.env.BOT_API_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  if (!isAuthorized(request)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const { code } = await params;
  const paymentRequest = await getPaymentRequest(code);
  if (!paymentRequest) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

  return NextResponse.json({ ok: true, request: paymentRequest });
}
