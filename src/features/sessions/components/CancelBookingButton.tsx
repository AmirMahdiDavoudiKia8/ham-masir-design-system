"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { showToast } from "@/lib/toast";
import type { PlanKey } from "@/lib/plans";
import { useBookingsStore } from "@/store/bookingsStore";
import { cancelBooking } from "../actions";

interface CancelBookingButtonProps {
  bookingId: string;
  mentorId: string;
  plan: PlanKey;
  /** The booked time label (ResolvedBooking.nextSessionAt) — together with mentorId+plan this is what actually identifies the booking server-side (see cancelStudentBooking for why not the id). */
  slot: string;
  /** Smaller, no-confirmation-sheet-styling variant for a row in the "بقیه‌ی هم‌مسیرها" list, vs. the full-size button under the featured card. */
  compact?: boolean;
}

/**
 * Cancels one specific one-off "session" (trial) booking — the counterpart
 * to CancelSessionButton, which only ever cancels a subscription. See
 * cancelBooking in ../actions for why a one-off booking needed its own path.
 */
export function CancelBookingButton({ bookingId, mentorId, plan, slot, compact }: CancelBookingButtonProps) {
  const router = useRouter();
  const cancelLocally = useBookingsStore((s) => s.cancelBooking);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await cancelBooking(mentorId, plan, slot);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      cancelLocally(bookingId);
      setOpen(false);
      showToast("جلسه لغو شد.", "success");
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          compact
            ? "cursor-pointer text-label font-semibold text-danger underline-offset-2 hover:underline"
            : "cursor-pointer text-center text-caption font-semibold text-danger underline-offset-2 hover:underline"
        }
      >
        لغو جلسه
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} ariaLabel="لغو جلسه">
        <div className="flex flex-col gap-4 pt-2">
          <h2 className="text-h3 font-bold text-foreground">مطمئنی می‌خوای این جلسه رو لغو کنی؟</h2>
          <p className="rounded-md bg-surface-alt px-3.5 py-2.5 text-caption font-semibold text-foreground">
            تا یک ساعت قبل جلسه، هزینه‌ی کامل بهت برمی‌گرده؛ در غیر این‌صورت ۷۰٪ مبلغ برگشت داده می‌شه.
          </p>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="h-14 w-full cursor-pointer rounded-md bg-danger text-body font-bold text-white transition-all duration-standard ease-gentle active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "در حال لغو…" : "لغو جلسه"}
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
