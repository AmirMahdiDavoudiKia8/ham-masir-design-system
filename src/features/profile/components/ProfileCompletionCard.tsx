import Link from "next/link";
import { ProfileCompletionGauge } from "./ProfileCompletionGauge";

interface ProfileCompletionCardProps {
  percent: number;
}

/** Tapping anywhere on the card goes straight to the edit-profile screen — the whole card is the CTA, not just a button inside it. */
export function ProfileCompletionCard({ percent }: ProfileCompletionCardProps) {
  return (
    <Link
      href="/student/profile/edit"
      className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 shadow-card transition-all duration-standard ease-gentle active:scale-[0.98] hover:border-primary-light"
    >
      <ProfileCompletionGauge percent={percent} />
      <p className="text-caption font-semibold text-foreground">
        برای اینکه هم‌مسیرت بهتر بتونه کمکت کنه، پروفایلتو تکمیل کن.
      </p>
    </Link>
  );
}
