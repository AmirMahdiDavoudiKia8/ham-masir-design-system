import type { Mentor } from "@/lib/mentors";
import type { Booking } from "@/store/bookingsStore";
import type { PlanKey } from "@/lib/plans";

/** A booking with its mentor resolved by id from the canonical source — this is the only shape the sessions UI components should ever see. */
export interface ResolvedBooking {
  id: string;
  mentorId: string;
  mentorName?: string;
  mentorField?: string;
  mentorPhoto?: string;
  plan?: PlanKey;
  planTitle?: string;
  nextSessionAt?: string;
  /** The mentor's Google Meet link, if they've set one yet (see SessionEntryButton) — only ever attached to the featured booking by SessionsHome, since there's one linked PortalStudent per phone identity. */
  meetLink?: string;
  status?: "upcoming" | "active" | "cancelled";
}

export function resolveBooking(booking: Booking, mentors: Mentor[]): ResolvedBooking {
  const mentor = mentors.find((m) => m.id === booking.mentorId);
  const mentorField = mentor ? [mentor.field, mentor.university].filter(Boolean).join("، ") : undefined;

  return {
    id: booking.id,
    mentorId: booking.mentorId,
    mentorName: mentor?.name,
    mentorField,
    mentorPhoto: mentor?.photo,
    plan: booking.plan,
    planTitle: booking.planTitle,
    nextSessionAt: booking.slot,
    status: booking.status,
  };
}
