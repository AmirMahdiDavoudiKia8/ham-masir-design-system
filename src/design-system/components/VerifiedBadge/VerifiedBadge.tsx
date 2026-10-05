/**
 * VerifiedBadge — the single most important trust signal.
 * Teal family, small check, meaningful — never a loud decorative sticker.
 * Label uses verified-strong (teal-700, 5.41:1 AA); plain verified-600
 * (3.81:1) is graphics/large-text only.
 *
 * Status: retire-candidate — nothing verified renders anywhere in product.
 */
import { cn } from "@/lib/cn";
export function VerifiedBadge({ label = "تأیید شده", className }: { label?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-label font-medium text-verified-strong", className)}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" />
        <path d="m5.5 8 1.8 1.8L10.8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </span>
  );
}
export default VerifiedBadge;
