/** Alert — calm notice. Behind-on-plan uses warm amber, never harsh red.
 *  Tones bind feedback-bg/text/border as a set; info is the dusty slate-teal.
 *
 * Status: proposal — generic inline-notice reserve (distinct from transient
 * Toast), not yet adopted by product. */
import { cn } from "@/lib/cn";
export type AlertTone = "info" | "success" | "alert" | "danger";
const tones: Record<AlertTone, string> = {
  info: "border-feedback-info-border/30 bg-feedback-info-bg text-foreground",
  success: "border-feedback-success-border/30 bg-feedback-success-bg text-foreground",
  alert: "border-feedback-warning-border/30 bg-feedback-warning-bg text-feedback-warning-text",
  danger: "border-feedback-danger-border/30 bg-surface text-foreground",
};
export function Alert({ tone = "info", title, children, className }: {
  tone?: AlertTone; title?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("rounded-card border border-border bg-surface p-4 shadow-none", tones[tone], className)}>
      {title && <p className="mb-1 text-caption font-semibold">{title}</p>}
      <div className="text-body">{children}</div>
    </div>
  );
}
export default Alert;
