import type { Mentor } from "@/lib/mentors";

export type PlanKey = "session" | "subscription";

/** Verbatim tier copy — the single source both the mentor profile page and the booking flow read from, so the two never drift. */
export const PLAN_META: Record<PlanKey, { title: string; subtitle: string }> = {
  session: {
    title: "طرح راه‌نما",
    subtitle: "یک جلسه‌ی ۴۵ دقیقه‌ای در گوگل‌میت با هم‌مسیرت، برای هر سؤالی درباره‌ی منابع، برنامه یا انتخاب رشته.",
  },
  subscription: {
    title: "طرح بادیگارد",
    subtitle: "۴ جلسه‌ی ۴۵ دقیقه‌ای در ماه، به‌همراه برنامه‌ریزی شخصی‌سازی‌شده و پیگیری مستمر پیشرفتت.",
  },
};

export function isPlanKey(value: string | undefined): value is PlanKey {
  return value === "session" || value === "subscription";
}

export function getPlanPrice(mentor: Mentor, plan: PlanKey): string | undefined {
  return plan === "session" ? mentor.sessionPrice : mentor.subscriptionPrice;
}

/**
 * Every mentor on the site charges the same amount (see the discover page's
 * own "همه‌ی هم‌مسیرها قیمت یکسانی دارن") — every curated catalogue entry in
 * src/data/mentors/mentors.json repeats these same two strings by hand.
 * A self-registered mentor-portal account (see lib/mentorPortal.ts) has no
 * price fields of its own and never should — there's nothing per-mentor to
 * set — so lib/mentors.ts's loadPortalMentors() stamps these fixed values
 * onto every portal-sourced mentor instead of leaving price blank.
 */
export const SITE_SESSION_PRICE = "۴۰۰ هزار تومان";
export const SITE_SUBSCRIPTION_PRICE = "۱ میلیون و ۸۰۰ هزار تومان";

const PLAN_PRICE_TEXT: Record<PlanKey, string> = {
  session: SITE_SESSION_PRICE,
  subscription: SITE_SUBSCRIPTION_PRICE,
};

/**
 * The same two prices as machine-readable numbers, for schema.org Offers.
 *
 * In **rials**, deliberately: `priceCurrency` takes an ISO 4217 code, and
 * there is no code for the toman — IRR is the rial. So each value is the
 * toman figure above ×10. Don't "fix" these to match the visible strings.
 */
export const PLAN_PRICE_IRR: Record<PlanKey, number> = {
  session: 4_000_000,
  subscription: 18_000_000,
};

/**
 * The numeric price for structured data — but only when this mentor still
 * shows the site-wide price the number above was derived from.
 *
 * Prices are free-text Persian repeated by hand in all 19 mentors.json
 * entries, so they can drift from PLAN_PRICE_IRR without anything failing.
 * When they do, returning undefined drops the Offer from the markup and the
 * page simply has no price in its schema — which is far better than
 * publishing a confidently wrong one under a named person's profile.
 */
export function getPlanPriceIrr(mentor: Mentor, plan: PlanKey): number | undefined {
  return getPlanPrice(mentor, plan) === PLAN_PRICE_TEXT[plan] ? PLAN_PRICE_IRR[plan] : undefined;
}
