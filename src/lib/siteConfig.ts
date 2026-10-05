export const SITE_URL = "https://hammasirsite.ir";
export const SITE_NAME = "هم‌مسیر";

/**
 * The one description search engines and link previews read. Leads with what
 * the site is (mentoring by students who sat the same exam), then the thing
 * that actually differentiates it — «پرداخت بعد از جلسه» (see
 * components/brand/PayAfterPromise). Kept under ~160 chars so Google renders
 * it whole instead of truncating mid-sentence.
 */
export const SITE_DESCRIPTION =
  "مشاوره و برنامه‌ریزی کنکور با دانشجوهایی که خودشون این مسیر رو رفتن. هم‌مسیرت رو انتخاب کن، جلسه بذار و بعد از جلسه پرداخت کن — فقط اگه راضی بودی.";

/** Short form for OpenGraph/Twitter cards, where the description is clipped harder than in search results. */
export const SITE_TAGLINE = "کنکور دو نفری آسون‌تره — پرداخت بعد از جلسه، فقط اگه راضی بودی.";

/**
 * The 1200×630 share card — the 1.91:1 ratio Telegram, Bale, WhatsApp and X
 * all crop to, so nothing important gets cut. Built from the brand palette
 * and the real Estedad face; it leads with «اول جلسه، بعد پرداخت» because
 * that promise is the reason someone forwards the link at all.
 *
 * Source is a rendered HTML layout, not a hand-drawn asset: to change the
 * wording or colours, re-render at 1200×630 and overwrite this file.
 */
export const SITE_OG_IMAGE = {
  url: `${SITE_URL}/brand/og.png`,
  width: 1200,
  height: 630,
  alt: "هم‌مسیر — اول جلسه، بعد پرداخت. و فقط اگه راضی بودی.",
};

/**
 * Terms a konkur student actually types. Google ignores the keywords meta
 * tag, but Bing and several Iranian crawlers still read it, and it costs
 * nothing — so it's here rather than nowhere.
 */
export const SITE_KEYWORDS = [
  "مشاوره کنکور",
  "برنامه ریزی کنکور",
  "مشاور کنکور",
  "منتور کنکور",
  "برنامه ریز کنکور",
  "مشاوره تحصیلی",
  "کنکور تجربی",
  "کنکور ریاضی",
  "کنکور انسانی",
  "برنامه مطالعاتی کنکور",
  "هم‌مسیر",
];

/** Contact + social identities, shared by the Organization JSON-LD and the /about page's own links. */
export const SITE_TELEGRAM = "https://t.me/hammasirsite";
export const SITE_BALE = "https://ble.ir/hammasirsite";
/** Username really does contain a dot — it is `hammasirsite.ir`, not a domain that slipped in. */
export const SITE_INSTAGRAM = "https://www.instagram.com/hammasirsite.ir";
export const SITE_PHONE = "+989920209010";
/** Display form of SITE_PHONE — Persian digits, local 0-prefix, as it's read aloud. */
export const SITE_PHONE_DISPLAY = "۰۹۹۲۰۲۰۹۰۱۰";

/**
 * Next merges metadata **shallowly**: a page that declares its own
 * `openGraph` replaces the parent layout's wholesale, silently dropping
 * og:image, og:site_name, og:locale and og:type. Every page-level card must
 * therefore restate those, so build it here once instead of in each page —
 * where the omission is invisible until someone pastes a link into Telegram
 * and gets a blank preview.
 */
export function pageOpenGraph(input: {
  path: string;
  title: string;
  description: string;
  type?: "website" | "profile" | "article";
  images?: { url: string; width?: number; height?: number; alt?: string }[];
}) {
  return {
    type: input.type ?? ("website" as const),
    locale: "fa_IR",
    siteName: SITE_NAME,
    url: `${SITE_URL}${input.path}`,
    title: input.title,
    description: input.description,
    images: input.images ?? [SITE_OG_IMAGE],
  };
}
