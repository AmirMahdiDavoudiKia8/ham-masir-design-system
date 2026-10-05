import { randomUUID } from "node:crypto";
import { withFileLock } from "@/lib/fileLock";
import { readJson, writeJson } from "@/lib/storage";
import type { PlanKey } from "@/lib/plans";

export interface StoredBooking {
  id: string;
  mentorId: string;
  plan: PlanKey;
  planTitle: string;
  slot: string;
  price?: string;
  status: "upcoming" | "active" | "cancelled";
  createdAt: string;
}

const FILE = "src/data/studentBookings.json";

async function getAll(): Promise<Record<string, StoredBooking[]>> {
  return readJson<Record<string, StoredBooking[]>>(FILE, {});
}

async function saveAll(data: Record<string, StoredBooking[]>): Promise<void> {
  await writeJson(FILE, data);
}

/**
 * The server-side half of a student's booking list, keyed by phone number —
 * so a booking made on one device shows up again once the same phone is
 * verified on another (or the same, cleared) device. bookingsStore's
 * localStorage copy stays the fast/optimistic read path; this is what makes
 * it durable across devices instead of trapped in one browser.
 */
export async function addStudentBooking(
  phone: string,
  input: Omit<StoredBooking, "id" | "createdAt">,
): Promise<StoredBooking> {
  return withFileLock(FILE, async () => {
    const all = await getAll();
    const list = all[phone] ?? [];

    // Same guard as the client store: an accidental double-submit for the
    // same mentor+plan+time shouldn't create a second server-side record
    // either. `plan` has to be part of the match — the app's own recommended
    // flow is to try a one-off "session" with a mentor before subscribing to
    // "بادیگارد" with them, and slots are picked from a small fixed list
    // (lib/slots.ts), so a genuinely new subscription booking landing on the
    // same mentor+slot as an earlier trial is a real, expected case, not a
    // duplicate — matching on mentorId+slot alone silently discarded it.
    //
    // Cancelled bookings never count as a match: every new booking now shares
    // one fixed slot label (lib/slots), so matching a cancelled one would make
    // re-booking that mentor after a cancellation impossible.
    const existing = list.find(
      (b) =>
        b.status !== "cancelled" && b.mentorId === input.mentorId && b.plan === input.plan && b.slot === input.slot,
    );
    if (existing) return existing;

    const booking: StoredBooking = {
      ...input,
      id: `bk_${randomUUID().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    all[phone] = [...list, booking];
    await saveAll(all);
    return booking;
  });
}

export async function getStudentBookings(phone: string): Promise<StoredBooking[]> {
  const all = await getAll();
  return all[phone] ?? [];
}

/** Full phone-keyed map, for cross-referencing bookings against leads/payments by phone (see lib/studentJourney.ts) rather than one phone at a time. */
export async function getAllStudentBookings(): Promise<Record<string, StoredBooking[]>> {
  return getAll();
}

/**
 * A one-off "session" (trial) booking has no PortalStudent relationship to
 * cancel (see cancelSession in features/sessions/actions.ts, which only ever
 * touches a subscription) — before this, a student who'd only booked a
 * one-off session had literally no way to cancel it from their side. Marks
 * the booking cancelled in place (kept, not deleted, so it still shows in
 * history) rather than removing it.
 *
 * Matched by mentorId+plan+slot, not id: the client's local bookingsStore
 * generates its own booking id independently of the one this file generates
 * in addStudentBooking above (the POST response that carries the real id is
 * never read back into the client store), so the two ids never actually
 * match. mentorId+plan+slot is the same key addStudentBooking's own dedup
 * check already treats as "the same booking" — reusing it here instead of
 * plumbing the server id back to the client keeps both in sync with a single
 * source of truth. Returns null if this phone has no matching booking.
 */
export async function cancelStudentBooking(
  phone: string,
  mentorId: string,
  plan: PlanKey,
  slot: string,
): Promise<StoredBooking | null> {
  return withFileLock(FILE, async () => {
    const all = await getAll();
    const list = all[phone] ?? [];
    // The newest still-active match: with one shared slot label (lib/slots),
    // an earlier cancelled booking with the same mentor+plan also matches the
    // key and must not be the one picked.
    let index = -1;
    for (let i = list.length - 1; i >= 0; i--) {
      const b = list[i];
      if (b.status !== "cancelled" && b.mentorId === mentorId && b.plan === plan && b.slot === slot) {
        index = i;
        break;
      }
    }
    if (index === -1) return null;

    const updated: StoredBooking = { ...list[index], status: "cancelled" };
    all[phone] = [...list.slice(0, index), updated, ...list.slice(index + 1)];
    await saveAll(all);
    return updated;
  });
}
