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
