import Link from "next/link";
import { buttonClasses } from "@/design-system";
import { EmptyState } from "@/design-system";
import { ProgressIcon } from "@/design-system";
import type { CancellationInfo } from "@/lib/mentorPortal";

interface ProgressCancelledStateProps {
  cancelled: CancellationInfo;
  mentorName?: string;
}

/** Shown instead of the weekly plan once either side has cancelled the subscription — see lib/mentorPortal.ts's `cancelled` field. */
export function ProgressCancelledState({ cancelled, mentorName }: ProgressCancelledStateProps) {
  return (
    <EmptyState
      icon={<ProgressIcon className="h-6 w-6" />}
      title={cancelled.by === "mentor" ? `متاسفانه ${mentorName ?? "هم‌مسیرت"} این همراهی رو لغو کرد` : "این همراهی رو لغو کردی"}
      description="می‌تونی از همین‌جا یه هم‌مسیر جدید انتخاب کنی."
      action={
        <Link href="/student/discover" className={buttonClasses("primary", "md", false, "mt-1")}>
          پیدا کردن هم‌مسیر جدید
        </Link>
      }
    />
  );
}
