import { buttonClasses } from "@/components/ui/Button";

interface SessionEntryButtonProps {
  /** The mentor's Google Meet link (see StudentPlanEditor). */
  meetLink: string;
}

/**
 * "ورود به جلسه" opens the mentor's Google Meet link directly — no exact-time
 * gating, because sessions here are request-based windows (see lib/slots.ts),
 * not scheduled at a machine-readable instant. Once the mentor has set a
 * link, the student can open it whenever they've agreed to meet.
 *
 * There is deliberately no disabled/"not yet" state: before a link exists
 * there is nothing to enter, and a greyed-out button plus a "بعد از تأیید
 * هم‌مسیر فعال می‌شه" caption just made the wait look like a broken screen.
 * The card says what actually happens next (a phone call) instead, and only
 * renders this once entering is genuinely possible — see UpcomingSessionCard.
 */
export function SessionEntryButton({ meetLink }: SessionEntryButtonProps) {
  return (
    <a href={meetLink} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary", "lg", true)}>
      ورود به جلسه
    </a>
  );
}
