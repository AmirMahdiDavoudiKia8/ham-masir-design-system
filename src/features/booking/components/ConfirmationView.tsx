import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { CheckIcon, SparkleIcon } from "@/components/ui/icons";
import { MentorAvatar } from "@/features/mentors/components/MentorAvatar";
import type { Mentor } from "@/lib/mentors";
import { PLAN_META, type PlanKey } from "@/lib/plans";

interface ConfirmationViewProps {
  mentor: Mentor;
  plan: PlanKey;
  slot: string;
}

/**
 * Screen C: a quiet affirmation, not a celebration (brand.md §7 — no
 * fireworks/confetti/trophies). A soft check in the --success tint (this is
 * a progress signal, distinct from the teal --verified trust badge) and a
 * calm recap.
 */
export function ConfirmationView({ mentor, plan, slot }: ConfirmationViewProps) {
  const subtitle = [mentor.field, mentor.university].filter(Boolean).join("، ");
  const name = mentor.name ?? "هم‌مسیر";

  return (
    <div className="flex flex-col items-center gap-6 px-4 pb-2 pt-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
        <CheckIcon className="h-8 w-8" strokeWidth={2.5} />
      </span>

      <div className="flex flex-col gap-1.5">
        <h1 className="text-h1 font-bold text-foreground">
          مسیرت شروع شد، {name} کنارته.
        </h1>
        <p className="text-body text-muted-foreground">از همین‌جا شروع می‌کنیم؛ بقیه‌ش رو با هم جلو می‌ریم.</p>
      </div>

      <div className="w-full rounded-lg border border-border bg-surface p-4 text-right shadow-card">
        <div className="flex items-center gap-3">
          <MentorAvatar photo={mentor.photo} name={mentor.name} size={48} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-h3 font-semibold text-foreground">{name}</p>
            {subtitle && <p className="truncate text-caption text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        <dl className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-caption text-muted-foreground">پلن</dt>
            <dd className="truncate text-sm font-bold text-foreground">{PLAN_META[plan].title}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-caption text-muted-foreground">زمان</dt>
            <dd className="truncate text-sm font-bold text-foreground">{slot}</dd>
          </div>
        </dl>
      </div>

      <p className="text-caption text-muted-foreground">
        به‌زودی برای هماهنگ کردن تایم دقیق باهات تماس می‌گیریم. هر سوالی داشتی به{" "}
        <Link href="/student/profile/support" className="font-semibold text-primary">
          پشتیبانی
        </Link>{" "}
        پیام بده.
      </p>

      <Link
        href="/student/profile/edit"
        className="flex w-full items-center gap-3 rounded-lg border border-primary-light/40 bg-gradient-to-l from-secondary-soft via-primary-soft to-primary-light/30 p-4 text-right shadow-brand transition-all duration-standard ease-gentle active:scale-[0.98] hover:border-primary-light"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-primary-foreground shadow-card">
          <SparkleIcon className="h-5 w-5" />
        </span>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-body font-bold text-foreground">نظرت چیه پروفایلت رو کامل کنیم؟</h2>
          <p className="text-caption text-muted-foreground">
            این‌طوری هم‌مسیرت برای جلسه آماده‌تره و می‌تونه موضوعات مهم‌تر رو سریع‌تر بهت برسونه.
          </p>
        </div>
      </Link>

      <div className="flex w-full flex-col gap-3">
        <Link href="/student/home" className={buttonClasses("primary", "lg", true)}>
          جلسه‌های من
        </Link>
        <Link href="/student/home" className={buttonClasses("outline", "lg", true)}>
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
