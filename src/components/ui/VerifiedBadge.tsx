import { CheckIcon } from "@/components/ui/icons";

/**
 * The product's primary trust signal — shown only when a mentor is
 * verified. Kept small but solid/high-contrast so it reads as meaningful,
 * not decorative.
 */
export function VerifiedBadge() {
  return (
    <span
      title="تأیید شده توسط هم‌مسیر"
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-verified text-primary-foreground"
    >
      <CheckIcon className="h-3 w-3" strokeWidth={2.75} />
      <span className="sr-only">تأیید شده</span>
    </span>
  );
}
