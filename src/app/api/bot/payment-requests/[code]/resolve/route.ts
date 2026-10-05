import { NextResponse } from "next/server";
import { resolvePaymentRequest } from "@/lib/paymentRequests";

function isAuthorized(request: Request): boolean {
  const secret = process.env.BOT_API_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

interface ResolvePayload {
  status?: "approved" | "rejected";
}

/** Called by the admin-facing bot flow once the ✅/❌ button on the receipt is tapped. */
export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
  if (!isAuthorized(request)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  let body: ResolvePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  if (body.status !== "approved" && body.status !== "rejected") {
    return NextResponse.json({ ok: false, error: "invalid status" }, { status: 400 });
  }

  const { code } = await params;
  const paymentRequest = await resolvePaymentRequest(code, body.status);
  if (!paymentRequest) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

  return NextResponse.json({ ok: true, request: paymentRequest });
}
