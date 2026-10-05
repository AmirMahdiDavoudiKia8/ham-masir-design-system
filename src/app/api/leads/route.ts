import { NextResponse } from "next/server";
import { logLead } from "@/lib/leads";
import type { LeadType } from "@/lib/leadTypes";

interface LeadPayload {
  type?: LeadType;
  data?: Record<string, string>;
}

/**
 * Forwards quiz answers / booking identity captures to a Google Sheet via
 * an Apps Script web app (see setup notes) — kept server-side so the
 * script's URL and shared secret never reach the browser bundle.
 *
 * Never blocks or fails the caller's actual flow (quiz/booking) on a
 * Sheets outage or missing config: unconfigured or unreachable just means
 * "skipped", not a 500 the client has to handle.
 */
export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  if (
    body.type !== "quiz" &&
    body.type !== "identity" &&
    body.type !== "mentor_signup" &&
    body.type !== "mentor_request" &&
    body.type !== "booking" &&
    body.type !== "cancellation" &&
    body.type !== "planner"
  ) {
    return NextResponse.json({ ok: false, error: "invalid type" }, { status: 400 });
  }

  // Awaits only the local write (fast disk I/O) — the Sheet forward inside
  // logLead stays fire-and-forget on its own, since that network round-trip
  // has been observed taking 15-20s from this VPS, which would otherwise
  // stall every caller (quiz submit, mentor request card, etc.).
  await logLead(body.type, body.data ?? {});

  return NextResponse.json({ ok: true });
}
