import { buttonClasses } from "@/components/ui/Button";

interface SessionEntryButtonProps {
  /** The mentor's Google Meet link (see StudentPlanEditor) — missing until the mentor sets one, which is exactly what keeps this disabled. */
  meetLink?: string;
  /** Persian display label, e.g. "شنبه ساعت ۲۰:۰۰" — shown on the button itself. */
  label?: string;
}

/**
 * "ورود به جلسه" opens the mentor's Google Meet link directly — no exact-time
 * gating, because sessions here are request-based windows (see lib/slots.ts),
 * not scheduled at a machine-readable instant. Once the mentor has set a
 * link, the student can open it whenever they've agreed to meet.
 */
export function SessionEntryButton({ meetLink, label }: SessionEntryButtonProps) {
  if (!meetLink) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className={buttonClasses("outline", "lg", true, "pointer-events-none opacity-50")}>
          <span className="flex flex-col items-center gap-0.5 leading-tight">
            <span>ورود به جلسه</span>
            {label && <span className="text-caption font-medium opacity-80">{label}</span>}
          </span>
        </span>
        <p className="text-center text-caption text-muted-foreground">بعد از تأیید هم‌مسیر فعال می‌شه</p>
      </div>
    );
  }

  return (
    <a href={meetLink} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary", "lg", true)}>
      <span className="flex flex-col items-center gap-0.5 leading-tight">
        <span>ورود به جلسه</span>
        {label && <span className="text-caption font-medium opacity-80">{label}</span>}
      </span>
    </a>
  );
}
