"use client";

import { useState, useTransition } from "react";
import { setApproval } from "@/app/mentor/admin/mentors/actions";

interface ApprovalButtonProps {
  mentorId: string;
  /** Current state — the button always performs the opposite. */
  approved: boolean;
}

/**
 * Approve / un-approve, in place. Un-approving is the destructive-looking
 * direction (a live mentor disappears from the site), so it asks first —
 * everything else about it is reversible with one more click.
 */
export function ApprovalButton({ mentorId, approved }: ApprovalButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  function handleClick() {
    if (approved && !confirm("این منتور از سایت برداشته می‌شه و دیگه هیچ دانش‌آموزی نمی‌بیندش. مطمئنی؟")) return;
    setError(undefined);
    startTransition(async () => {
      const result = await setApproval(mentorId, !approved);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={`shrink-0 rounded-lg px-4 py-2 text-caption font-bold transition disabled:opacity-50 ${
          approved ? "border border-border text-danger hover:bg-alert-soft" : "bg-primary text-white hover:opacity-90"
        }`}
      >
        {pending ? "..." : approved ? "برداشتن از سایت" : "تایید و انتشار"}
      </button>
      {error && <span className="text-label text-danger">{error}</span>}
    </div>
  );
}
