"use client";

import { CoinIcon } from "@/components/ui/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tag } from "@/design-system";
import { MentorAvatar } from "@/features/mentors/components/MentorAvatar";
import { resolveBooking } from "@/features/sessions/resolveBooking";
import { toPersianDigits } from "@/lib/format";
import type { Mentor } from "@/lib/mentors";
import { useBookingsStore } from "@/store/bookingsStore";

interface PaymentHistoryProps {
  /** Canonical mentor list, fetched server-side — same resolve-by-id pattern as SessionsHome. */
  mentors: Mentor[];
}

const STATUS_LABEL: Record<string, string> = {
  upcoming: "در انتظار برگزاری",
  active: "برگزار شده",
  cancelled: "لغو شده",
};

/** Reservations are free; a still-upcoming session owes nothing yet, so its amount can't be shown as if it were already paid. */
const AMOUNT_NOTE: Record<string, string> = {
  upcoming: "پرداخت بعد از جلسه",
  active: "اگه راضی بودی",
  cancelled: "دریافت نشد",
};

function formatDate(iso: string): string {
  const formatted = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(iso),
  );
  return toPersianDigits(formatted);
}

/**
 * Every row is a booking, created the moment the reservation is placed (see
 * PaymentForm) — so this is a record of sessions and what each one will cost,
 * not of money already taken. Nothing is charged at reservation time
 * («اول جلسه، بعد پرداخت»), so the amounts here are settled after the
 * session and the copy must not imply a completed payment.
 */
export function PaymentHistory({ mentors }: PaymentHistoryProps) {
  const bookings = useBookingsStore((s) => s.bookings);

  if (bookings.length === 0) {
    return (
      <div className="px-4 pt-6">
        <EmptyState
          icon={<CoinIcon className="h-6 w-6" />}
          title="هنوز جلسه‌ای رزرو نکردی"
          description="وقتی با یک هم‌مسیر جلسه بذاری، جلسه و هزینه‌ش رو اینجا می‌بینی — پرداختش بعد از جلسه‌ست."
        />
      </div>
    );
  }

  const rows = bookings
    .map((booking) => ({ ...resolveBooking(booking, mentors), price: booking.price, createdAt: booking.createdAt }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col gap-3 px-4 pb-2 pt-6">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
          <MentorAvatar photo={row.mentorPhoto} name={row.mentorName} size={44} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-foreground">{row.mentorName ?? "هم‌مسیر"}</p>
              {row.status && <Tag className="shrink-0">{STATUS_LABEL[row.status]}</Tag>}
            </div>
            {row.planTitle && <p className="truncate text-caption text-muted-foreground">{row.planTitle}</p>}
            <p className="mt-1 text-caption text-muted-foreground">{formatDate(row.createdAt)}</p>
          </div>
          {row.price && (
            <div className="shrink-0 text-left">
              <p className="text-caption font-bold text-primary">{row.price}</p>
              {row.status && (
                <p className="text-label font-semibold text-muted-foreground">{AMOUNT_NOTE[row.status]}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
