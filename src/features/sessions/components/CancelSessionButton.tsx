"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { showToast } from "@/lib/toast";
import { cancelSession } from "../actions";

/** Opens a bottom sheet with the refund policy + an optional reason before actually cancelling — placed under the featured session card, only for a subscription (see UpcomingSessionCard). */
export function CancelSessionButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await cancelSession(reason);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
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
        className="cursor-pointer text-center text-caption font-semibold text-danger underline-offset-2 hover:underline"
      >
        لغو جلسه
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} ariaLabel="لغو جلسه">
        <div className="flex flex-col gap-4 pt-2">
          <h2 className="text-h3 font-bold text-foreground">مطمئنی می‌خوای لغو کنی؟</h2>
          <p className="rounded-md bg-surface-alt px-3.5 py-2.5 text-caption font-semibold text-foreground">
            تا یک ساعت قبل جلسه، هزینه‌ی کامل بهت برمی‌گرده؛ در غیر این‌صورت ۷۰٪ مبلغ برگشت داده می‌شه.
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-label font-semibold text-muted-foreground">چرا می‌خوای لغو کنی؟</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="دلیلت رو بنویس (اختیاری)"
              rows={3}
              className="w-full resize-none rounded-md border border-border bg-surface p-3 text-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
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
