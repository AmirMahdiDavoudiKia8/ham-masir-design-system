import { BookIcon, BuildingIcon, ChatIcon, LockIcon, PhoneIcon, SendIcon } from "@/components/ui/icons";

/** Shared across the support dropdown (SupportFab) and the site footer — one source so the two never drift. */
export const SITE_CONTACTS = [
  { key: "telegram", label: "تلگرام", detail: "@hammasirsite", href: "https://t.me/hammasirsite", Icon: SendIcon },
  { key: "bale", label: "بله", detail: "@hammasirsite", href: "https://ble.ir/hammasirsite", Icon: ChatIcon },
  { key: "phone", label: "تماس تلفنی", detail: "۰۹۹۲۰۲۰۹۰۱۰", href: "tel:09920209010", Icon: PhoneIcon },
] as const;

export const SITE_LEGAL_LINKS = [
  { key: "about", label: "درباره ما", href: "/about", Icon: BuildingIcon },
  { key: "terms", label: "قوانین و مقررات", href: "/terms", Icon: BookIcon },
  { key: "privacy", label: "حریم خصوصی", href: "/privacy", Icon: LockIcon },
] as const;
