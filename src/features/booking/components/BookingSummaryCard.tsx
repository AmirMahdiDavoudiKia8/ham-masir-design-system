import { ClockIcon } from "@/design-system";
import { MentorAvatar } from "@/features/mentors/components/MentorAvatar";
import type { Mentor } from "@/lib/mentors";
import { PLAN_META, getPlanPrice, type PlanKey } from "@/lib/plans";

interface BookingSummaryCardProps {
  mentor: Mentor;
  plan: PlanKey;
  /** Shown once a time has been proposed (screens B/C); omitted on screen A before selection. */
  slot?: string;
}

/** Compact mentor + plan (+ optional time) recap, reused across all three booking screens so the trail stays legible end to end. */
export function BookingSummaryCard({ mentor, plan, slot }: BookingSummaryCardProps) {
  const subtitle = [mentor.field, mentor.university].filter(Boolean).join("، ");
  const price = getPlanPrice(mentor, plan);
  const { title } = PLAN_META[plan];

  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
      <div className="flex items-center gap-3">
        <MentorAvatar photo={mentor.photo} name={mentor.name} size={48} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-h3 font-semibold text-foreground">{mentor.name ?? "هم‌مسیر"}</p>
          {subtitle && <p className="truncate text-caption text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="min-w-0">
          <p className="truncate text-caption text-muted-foreground">پلن انتخابی</p>
          <p className="truncate text-caption font-bold text-foreground">{title}</p>
        </div>
        {price && (
          <div className="shrink-0 text-left">
            <p className="text-caption font-bold text-primary">{price}</p>
            {/* Without this the price reads as "due now" — nothing in this flow is charged up front (see PayAfterPromise). */}
            <p className="text-label font-semibold text-muted-foreground">بعد از جلسه</p>
          </div>
        )}
      </div>

      {slot && (
        <div className="mt-3 flex items-center gap-1.5 text-caption text-muted-foreground">
          <ClockIcon className="h-4 w-4 shrink-0" />
          <span>{slot}</span>
        </div>
      )}
    </div>
  );
}
