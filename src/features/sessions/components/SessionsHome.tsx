"use client";

import type { CancellationInfo } from "@/lib/mentorPortal";
import type { Mentor } from "@/lib/mentors";
import { useBookingsStore } from "@/store/bookingsStore";
import { resolveBooking, type ResolvedBooking } from "../resolveBooking";
import { SessionListItem } from "./SessionListItem";
import { SessionsEmptyState } from "./SessionsEmptyState";
import { UpcomingSessionCard } from "./UpcomingSessionCard";

interface SessionsHomeProps {
  /** Canonical mentor list, fetched server-side — bookings only ever carry a mentorId, resolved against this. */
  mentors: Mentor[];
  /** This browser's linked mentor-portal student record's Meet link, if any (see lib/mentorPortal.ts) — there's only ever one, so it's attached to the featured booking only. */
  meetLink?: string;
  /** Set once either side cancels the subscription relationship — see lib/mentorPortal.ts. */
  cancelled?: CancellationInfo;
  /**
   * The real subscription relationship, built server-side from
   * PortalStudent.mentorId (see lib/mentorPortal.ts) — exists independently
   * of this browser's local bookingsStore. Without this, a student who
   * subscribed on a different device (or cleared this one's storage) saw
   * the "no sessions yet" marketing pitch despite having a real mentor, plan
   * and Meet link waiting for them the moment they log back in.
   */
  serverSession?: ResolvedBooking;
}

/**
 * The student's logged-in home base. The subscription relationship is
 * always featured over a one-off trial session when both exist — it's the
 * one with a real weekly plan, Meet link and cancellation state attached,
 * where a trial has none of that. `serverSession` only ever gets folded in
 * when the local store has no subscription entry of its own, so a
 * subscription made on *this* device is never duplicated as a second card.
 */
export function SessionsHome({ mentors, meetLink, cancelled, serverSession }: SessionsHomeProps) {
  const bookings = useBookingsStore((s) => s.bookings);
  const resolved = bookings.map((b) => resolveBooking(b, mentors));
  const hasLocalSubscription = resolved.some((b) => b.plan === "subscription");
  const combined = serverSession && !hasLocalSubscription ? [...resolved, serverSession] : resolved;

  if (combined.length === 0) {
    return <SessionsEmptyState />;
  }

  // A cancelled one-off session shouldn't outrank a still-active relationship
  // for the featured slot — but if literally everything is cancelled, still
  // show the most recent one rather than nothing.
  const active = combined.filter((b) => b.status !== "cancelled");
  const featuredPool = active.length > 0 ? active : combined;
  const featuredBase =
    featuredPool.find((b) => b.plan === "subscription") ??
    featuredPool.find((b) => b.status === "upcoming") ??
    featuredPool[0];
  const featured = featuredBase.plan === "subscription" ? { ...featuredBase, meetLink } : featuredBase;
  const rest = combined.filter((b) => b.id !== featured.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h1 font-bold text-foreground">
        با یه هم‌مسیر راه بلد مسیر کنکورت رو ده برابر آسون‌تر کن! بزودی باهات تماس می‌گیریم.
      </h1>

      <UpcomingSessionCard booking={featured} cancelled={featured.plan === "subscription" ? cancelled : undefined} />

      {rest.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-label font-medium text-foreground">بقیه‌ی هم‌مسیرها</h2>
          <div className="flex flex-col gap-3">
            {rest.map((booking) => (
              <SessionListItem key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
