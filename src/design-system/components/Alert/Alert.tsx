/** Alert — calm notice. Behind-on-plan uses warm amber, never harsh red.
 *  Tones bind feedback-bg/text/border as a set (never split, never color
 *  alone); info is the dusty slate-teal. Success (sage) and alert/danger
 *  (amber/terracotta) sit in different hue families from the teal brand so
 *  states are never confused with brand accents — light or dark.
 *  Every tone renders its own status icon beside the message (WCAG 1.4.1 —
 *  meaning is never carried by color alone).
 *
 * Status: proposal — generic inline-notice reserve (distinct from transient
 * Toast), not yet adopted by product. */
import { cn } from "@/lib/cn";
import { CheckIcon, InfoIcon, WarningIcon, XIcon } from "../../icons";
export type AlertTone = "info" | "success" | "alert" | "danger";
const tones: Record<AlertTone, string> = {
  info: "border-feedback-info-border bg-feedback-info-bg text-feedback-info-text",
  success: "border-feedback-success-border bg-feedback-success-bg text-feedback-success-text",
  alert: "border-feedback-warning-border bg-feedback-warning-bg text-feedback-warning-text",
  danger: "border-feedback-danger-border bg-feedback-danger-bg text-feedback-danger-text",
};
const toneIcons = {
  info: InfoIcon,
  success: CheckIcon,
  alert: WarningIcon,
  danger: XIcon,
} as const;
export function Alert({ tone = "info", title, children, className }: {
  tone?: AlertTone; title?: string; children: React.ReactNode; className?: string;
}) {
  const Icon = toneIcons[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("rounded-card border p-4 shadow-none", tones[tone], className)}>
      <div className="flex items-start gap-2">
        <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0">
          {title && <p className="mb-1 text-caption font-semibold">{title}</p>}
          <div className="text-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
export default Alert;
