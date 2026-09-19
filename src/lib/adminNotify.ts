import webpush from "web-push";
import { LEAD_TYPE_LABEL, type LeadType } from "@/lib/leadTypes";
import { getSubscriptions, removeSubscriptions } from "@/lib/pushSubscriptions";

/**
 * Pings the founder's phone the moment something worth acting on happens —
 * a new student, a booking, a mentor signing up — instead of it only showing
 * up the next time someone opens /mentor/admin/leads.
 *
 * Standard Web Push from the site itself: no bot, no third-party account.
 * The founder turns it on once per device from the admin area
 * (EnablePushButton), which stores that device's subscription (see
 * lib/pushSubscriptions). Checked before building this: the Iranian VPS can
 * reach every browser push service (FCM, Apple, Mozilla, Windows), whereas
 * it cannot reach api.telegram.org at all — which ruled out a Telegram bot.
 *
 * Keys live only in persistent/.env.local on the server:
 *   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT
 * If they're missing this is a silent no-op, so a dev machine or a
 * half-configured server never breaks lead recording.
 */

/**
 * Which lead types buzz the phone. Quiz and planner answers are left out on
 * purpose: they fire on every anonymous visitor who plays with a tool, and a
 * phone that buzzes for everything teaches you to ignore it — the ones that
 * matter would drown. They're still recorded in leads.json as before.
 */
const NOTIFY_TYPES: ReadonlySet<LeadType> = new Set<LeadType>([
  "identity",
  "booking",
  "mentor_signup",
  "mentor_request",
  "cancellation",
]);

const EMOJI: Partial<Record<LeadType, string>> = {
  identity: "🆕",
  booking: "📅",
  mentor_signup: "🧑‍🏫",
  mentor_request: "🙋",
  cancellation: "❌",
};

/** Persian labels for the fields callers actually send; anything else is shown under its raw key rather than dropped. */
const FIELD_LABEL: Record<string, string> = {
  name: "اسم",
  phone: "موبایل",
  mentorName: "منتور",
  mentorId: "شناسه منتور",
  plan: "طرح",
  slot: "زمان پیشنهادی",
  code: "کد رزرو",
  reason: "دلیل",
  by: "توسط",
  city: "شهر",
  stage: "مقطع",
  fieldOfStudy: "رشته",
  goal: "هدف",
  need: "نیاز",
  field: "رشته منتور",
  rank: "رتبه",
  university: "دانشگاه",
  gender: "جنسیت",
  notes: "توضیحات",
};

function formatBody(data: Record<string, string>): string {
  return Object.entries(data)
    .filter(([, value]) => value && String(value).trim())
    .map(([key, value]) => `${FIELD_LABEL[key] ?? key}: ${String(value).trim()}`)
    .join("\n");
}

export function isPushConfigured(): boolean {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

/** Sends one notification to every subscribed device, pruning the ones the push service says are gone. Never throws. */
export async function sendAdminPush(title: string, body: string, url = "/mentor/admin/leads"): Promise<number> {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return 0;

  const subscriptions = await getSubscriptions();
  if (subscriptions.length === 0) return 0;

  const payload = JSON.stringify({ title, body, url });
  const vapidDetails = {
    subject: process.env.VAPID_SUBJECT || "https://hammasirsite.ir",
    publicKey,
    privateKey,
  };

  const dead: string[] = [];
  let delivered = 0;
  await Promise.all(
    subscriptions.map(async ({ subscription }) => {
      try {
        // TTL: a phone that's off for a few hours should still get it when it
        // comes back; after a day the lead is on the dashboard anyway.
        await webpush.sendNotification(subscription, payload, { vapidDetails, TTL: 60 * 60 * 24, timeout: 8000 });
        delivered++;
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        // 404/410 = the browser dropped this subscription (site data cleared,
        // permission revoked). It will never work again — stop trying.
        if (status === 404 || status === 410) dead.push(subscription.endpoint);
        else console.error("[adminNotify] push failed:", status ?? (err instanceof Error ? err.message : err));
      }
    }),
  );
  await removeSubscriptions(dead).catch(() => {});
  return delivered;
}

/**
 * Called from logLead after the lead is safely written. Fire-and-forget:
 * losing a ping must never lose a lead or fail a booking — leads.json is the
 * real record, this is a convenience on top of it.
 */
export async function notifyAdmin(type: LeadType, data: Record<string, string>): Promise<void> {
  if (!NOTIFY_TYPES.has(type)) return;
  try {
    await sendAdminPush(`${EMOJI[type] ?? "🔔"} ${LEAD_TYPE_LABEL[type]}`, formatBody(data));
  } catch (err) {
    console.error("[adminNotify]", err instanceof Error ? err.message : err);
  }
}
