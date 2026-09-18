import {
  BookIcon,
  BuildingIcon,
  ChatIcon,
  InstagramIcon,
  LockIcon,
  PhoneIcon,
  SendIcon,
} from "@/components/ui/icons";
import {
  SITE_BALE,
  SITE_INSTAGRAM,
  SITE_PHONE_DISPLAY,
  SITE_TELEGRAM,
} from "@/lib/siteConfig";

/**
 * Shared across the support dropdown (SupportFab), the site footer and
 * /about — one source so they never drift. They had already drifted: /about
 * carried a hand-copied duplicate of this array, so adding Instagram here
 * would have shown it everywhere except the page that exists to say who we
 * are.
 *
 * The hrefs come from siteConfig rather than being retyped, because the same
 * URLs are the Organization's `sameAs` in app/layout.tsx. A profile Google is
 * told we own must be one a visitor can actually click — keeping both from
 * one constant is what makes that true by construction.
 */
export const SITE_CONTACTS = [
  { key: "telegram", label: "تلگرام", detail: "@hammasirsite", href: SITE_TELEGRAM, Icon: SendIcon },
  { key: "bale", label: "بله", detail: "@hammasirsite", href: SITE_BALE, Icon: ChatIcon },
  { key: "instagram", label: "اینستاگرام", detail: "@hammasirsite.ir", href: SITE_INSTAGRAM, Icon: InstagramIcon },
  { key: "phone", label: "تماس تلفنی", detail: SITE_PHONE_DISPLAY, href: "tel:09920209010", Icon: PhoneIcon },
] as const;

export const SITE_LEGAL_LINKS = [
  { key: "about", label: "درباره ما", href: "/about", Icon: BuildingIcon },
  { key: "terms", label: "قوانین و مقررات", href: "/terms", Icon: BookIcon },
  { key: "privacy", label: "حریم خصوصی", href: "/privacy", Icon: LockIcon },
] as const;
