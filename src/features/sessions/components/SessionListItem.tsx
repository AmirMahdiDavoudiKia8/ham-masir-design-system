import { Tag } from "@/design-system";
import { MentorAvatar } from "@/features/mentors/components/MentorAvatar";
import type { ResolvedBooking } from "../resolveBooking";
import { CancelBookingButton } from "./CancelBookingButton";

interface SessionListItemProps {
  booking: ResolvedBooking;
}

const STATUS_LABEL: Record<string, string> = {
  upcoming: "جلسه‌ی بعدی",
  active: "فعال",
  cancelled: "لغو شده",
};

/** Mostly calm — the only action here is cancelling a one-off "session" (trial) booking that isn't already cancelled (a subscription's cancel lives on the featured card instead, see UpcomingSessionCard). */
export function SessionListItem({ booking }: SessionListItemProps) {
  const { mentorName, mentorField, mentorPhoto, planTitle, nextSessionAt, status, plan } = booking;
  const line = [planTitle, mentorField].filter(Boolean).join(" · ");

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
      <MentorAvatar photo={mentorPhoto} name={mentorName} size={44} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-foreground">{mentorName ?? "هم‌مسیر"}</p>
          {status && <Tag className="shrink-0">{STATUS_LABEL[status]}</Tag>}
        </div>
        {line && <p className="truncate text-caption text-muted-foreground">{line}</p>}
        {/* No time line here, same reasoning as UpcomingSessionCard: the slot is
            a rough window the student proposed, not a time anyone confirmed. */}
      </div>
      {plan === "session" && status !== "cancelled" && (
        <CancelBookingButton
          bookingId={booking.id}
          mentorId={booking.mentorId}
          plan={plan}
          slot={nextSessionAt ?? ""}
          compact
        />
      )}
    </div>
  );
}
