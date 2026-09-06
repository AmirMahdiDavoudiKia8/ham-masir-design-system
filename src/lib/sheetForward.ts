export type LeadType = "quiz" | "identity" | "mentor_signup" | "mentor_request" | "booking" | "cancellation" | "planner";

export const LEAD_TYPE_LABEL: Record<LeadType, string> = {
  quiz: "کوییز",
  identity: "ثبت‌نام/تکمیل پروفایل",
  mentor_signup: "ثبت‌نام منتور",
  mentor_request: "درخواست منتور خاص",
  booking: "رزرو",
  cancellation: "لغو",
  planner: "برنامه‌ساز کنکور",
};

/**
 * Forwards data to the Google Sheet via the Apps Script webhook (see
 * .env.local.example). Shared by the /api/leads route (client-side calls)
 * and anything running server-side that wants to skip the internal HTTP
 * hop (e.g. the mentor registration server action). Never throws: an
 * unconfigured or unreachable sheet just means "skipped".
 */
export async function forwardToSheet(type: LeadType, data: Record<string, string>): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEET_SECRET;
  if (!webhookUrl || !secret) return;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, type, data }),
    });
    // Google Apps Script deployments break silently from this app's point of
    // view (a stale URL from "New deployment" instead of "Deploy new
    // version", a revoked/expired deployment, a moved/deleted underlying
    // file) — it did once, for an unknown stretch of time, with zero visible
    // sign anywhere. Logging here doesn't fix that, but it's the difference
    // between finding out from `pm2 logs` vs. never finding out at all.
    if (!res.ok) console.error(`[sheetForward] webhook returned ${res.status} for type=${type}`);
  } catch (err) {
    console.error(`[sheetForward] webhook request failed for type=${type}:`, err);
  }
}
