import { NextResponse } from "next/server";
import { recordEvent, type AnalyticsEventType } from "@/lib/analytics";

interface Payload {
  type?: string;
  path?: string;
  label?: string;
  visitorId?: string;
}

function isEventType(value: unknown): value is AnalyticsEventType {
  return value === "pageview" || value === "click";
}

/** Fire-and-forget target for the client-side tracker — never worth failing the caller's UI over, so this always returns ok even on a bad body. */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  if (!isEventType(body.type) || !body.path?.trim()) {
    return NextResponse.json({ ok: true });
  }

  await recordEvent({
    type: body.type,
    path: body.path.trim(),
    label: body.label?.trim() || undefined,
    visitorId: body.visitorId?.trim() || undefined,
  });

  return NextResponse.json({ ok: true });
}
