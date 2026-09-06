/**
 * The lead taxonomy — what kinds of thing get recorded in leads.json and how
 * each is labelled in the admin dashboard (/mentor/admin/leads).
 *
 * These used to live in lib/sheetForward.ts, which also forwarded every lead
 * to an external Google Sheet. That forwarding is gone (the admin dashboard
 * covers the same need, including a CSV export), but the taxonomy is used by
 * the dashboard, the /api/leads route and the student journey view, so it
 * lives here on its own now rather than inside a module about delivery.
 */
export type LeadType =
  | "quiz"
  | "identity"
  | "mentor_signup"
  | "mentor_request"
  | "booking"
  | "cancellation"
  | "planner";

export const LEAD_TYPE_LABEL: Record<LeadType, string> = {
  quiz: "کوییز",
  identity: "ثبت‌نام/تکمیل پروفایل",
  mentor_signup: "ثبت‌نام منتور",
  mentor_request: "درخواست منتور خاص",
  booking: "رزرو",
  cancellation: "لغو",
  planner: "برنامه‌ساز کنکور",
};
