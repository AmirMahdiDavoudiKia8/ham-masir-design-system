"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanKey } from "@/lib/plans";

export type BookingStatus = "upcoming" | "active" | "cancelled";

/**
 * A booking references a mentor by `mentorId` only — it never duplicates
 * the mentor's name/field/photo. Those are always resolved through the one
 * canonical mentor source (lib/mentors.ts) at render time, so a mentor's
 * details can never drift out of sync with what was actually booked.
 */
export interface Booking {
  id: string;
  mentorId: string;
  plan: PlanKey;
  planTitle: string;
  /** Proposed time label from the booking flow — request-based, not a confirmed Date (see lib/slots.ts). */
  slot: string;
  price?: string;
  status: BookingStatus;
  createdAt: string;
  /** Reference code from src/lib/paymentRequests, shown on the payment screen — carried here so navigating away and back (or reloading) can restore that screen instead of restarting the booking flow. */
  payCode?: string;
}

interface BookingsState {
  bookings: Booking[];
  addBooking: (input: Omit<Booking, "id" | "createdAt">) => Booking;
  /** Merges bookings fetched from the server (see lib/studentBookings) in by phone — used once a phone number is verified, so a booking made on another device shows up here too. Never drops a local booking the server doesn't know about yet. */
  restoreBookings: (fetched: Booking[]) => void;
  /** Wipes this device's cached bookings — part of "خروج از حساب" (see ProfileActions), so the next person to log in on this device doesn't inherit the previous student's mentor/plan info. */
  clearBookings: () => void;
  /** Reflects a successful server-side cancellation (see cancelBooking in features/sessions/actions.ts) into this device's local copy — a no-op if the id isn't found locally (e.g. cancelled from another device). */
  cancelBooking: (id: string) => void;
}

/**
 * The single source of truth for the student's bookings — written to once,
 * at the moment mock payment succeeds (PaymentForm), and read by every
 * screen that shows booking/mentor info (Home, Progress). Persisted to
 * localStorage so it survives a reload.
 *
 * TODO: this is the seam where a real backend replaces local persistence —
 * swap the `persist` storage for a server sync (POST on addBooking, GET on
 * load) without touching any screen that reads `useBookingsStore`.
 */
export const useBookingsStore = create<BookingsState>()(
  persist(
    (set, get) => ({
      bookings: [],
      addBooking: (input) => {
        // Guards against an accidental double-submit (e.g. a second payment
        // click) creating a duplicate booking for the same mentor+plan+time.
        // `plan` has to be part of the match — subscribing to "بادیگارد"
        // with a mentor you'd already tried a one-off "session" with (the
        // app's own recommended flow) lands on the same mentor+slot from a
        // small fixed slot list (lib/slots.ts), and is a real new booking,
        // not a duplicate of the trial.
        const existing = get().bookings.find(
          (b) => b.mentorId === input.mentorId && b.plan === input.plan && b.slot === input.slot,
        );
        if (existing) return existing;

        const booking: Booking = {
          ...input,
          id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ bookings: [...state.bookings, booking] }));
        return booking;
      },
      restoreBookings: (fetched) => {
        set((state) => {
          const merged = [...state.bookings];
          for (const booking of fetched) {
            const exists = merged.some(
              (b) => b.id === booking.id || (b.mentorId === booking.mentorId && b.slot === booking.slot),
            );
            if (!exists) merged.push(booking);
          }
          return { bookings: merged };
        });
      },
      clearBookings: () => set({ bookings: [] }),
      cancelBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
        })),
    }),
    { name: "hammasir-bookings" },
  ),
);
