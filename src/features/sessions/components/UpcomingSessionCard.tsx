import Link from "next/link";
import { ProgressIcon } from "@/design-system";
import { MentorAvatar } from "@/features/mentors/components/MentorAvatar";
import type { CancellationInfo } from "@/lib/mentorPortal";
import type { ResolvedBooking } from "../resolveBooking";
import { CancelBookingButton } from "./CancelBookingButton";
import { CancelSessionButton } from "./CancelSessionButton";
import { SessionEntryButton } from "./SessionEntryButton";

interface UpcomingSessionCardProps {
  booking: ResolvedBooking;
  /** Only ever set for a subscription plan (see SessionsHome) — a one-off session booking's cancellation state lives on the booking itself (booking.status) instead, since there's no server-side portal relationship for it. */
  cancelled?: CancellationInfo;
}

/**
 * The featured relationship on the home screen — deliberately the most
 * visually prominent thing here (brand.md: "you're set, someone's with
 * you"). "ورود به جلسه" only turns on once the mentor has set a Meet link
 * (see SessionEntryButton).
 */
export function UpcomingSessionCard({ booking, cancelled }: UpcomingSessionCardProps) {
  const { mentorName, mentorField, mentorPhoto, planTitle, nextSessionAt, meetLink, plan, status } = booking;
  const bookingCancelled = plan === "session" && status === "cancelled";

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center gap-3">
        <MentorAvatar photo={mentorPhoto} name={mentorName} size={56} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-h3 font-semibold text-foreground">{mentorName ?? "هم‌مسیر"}</p>
          {mentorField && <p className="truncate text-caption text-muted-foreground">{mentorField}</p>}
        </div>
      </div>

      {planTitle && <p className="mt-3.5 text-sm font-bold text-foreground">{planTitle}</p>}

      {cancelled || bookingCancelled ? (
        <div className="mt-4 flex flex-col gap-3 rounded-md bg-alert-soft px-4 py-3">
          <p className="text-caption font-semibold text-danger">
            {cancelled
              ? cancelled.by === "mentor"
                ? `متاسفانه ${mentorName ?? "هم‌مسیرت"} این همراهی رو لغو کرد.`
                : "این همراهی رو لغو کردی."
              : "این جلسه رو لغو کردی."}
          </p>
          <Link href="/student/discover" className="text-caption font-bold text-primary">
            پیدا کردن هم‌مسیر جدید
          </Link>
        </div>
      ) : (
        <>
          {/* The slot a student picked is a rough window ("پس‌فردا صبح"), not a
              real appointment — showing it as a time tag read as a confirmed
              time nobody had agreed to yet. The actual time is settled on the
              phone call this line promises, so that promise is all this says
              until the mentor sets a Meet link. */}
          <p className="mt-3 text-caption leading-[1.9] text-muted-foreground">
            به‌زودی باهات تماس می‌گیریم تا تایم دقیق جلسه رو باهم مشخص کنیم.
          </p>

          {meetLink && (
            <div className="mt-4 flex flex-col gap-2.5">
              <SessionEntryButton meetLink={meetLink} />
            </div>
          )}

          {plan === "subscription" && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-md bg-surface-alt px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <ProgressIcon className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                <span className="truncate text-caption text-muted-foreground">برنامه‌ی این هفته</span>
              </div>
              {/* TODO: route to the real progress screen once it exists */}
              <Link href="/student/progress" className="shrink-0 text-caption font-bold text-primary">
                برنامه و پیشرفت
              </Link>
            </div>
          )}

          {plan === "subscription" && (
            <div className="mt-4 flex justify-center">
              <CancelSessionButton />
            </div>
          )}

          {plan === "session" && (
            <div className="mt-4 flex justify-center">
              <CancelBookingButton
                bookingId={booking.id}
                mentorId={booking.mentorId}
                plan={plan}
                slot={nextSessionAt ?? ""}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
