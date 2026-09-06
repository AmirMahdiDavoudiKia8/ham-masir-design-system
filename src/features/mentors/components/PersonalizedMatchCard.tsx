import Link from "next/link";
import { cn } from "@/lib/cn";
import { CheckIcon, EditIcon, SparkleIcon } from "@/components/ui/icons";

interface PersonalizedMatchCardProps {
  /** True once the student has already answered the match quiz — swaps the invite copy for a toggle instead of asking again. */
  answered: boolean;
  /** Only meaningful once `answered` — whether the list below is currently narrowed to the quiz's picks. */
  active?: boolean;
  /** Only meaningful once `answered` — flips `active`. */
  onToggle?: () => void;
}

/**
 * Sits above the results grid. Before the quiz: a nudge toward it
 * (/student/mentors/quiz) so the student gets a curated shortlist instead of
 * scrolling everyone themselves. After: a toggle — tapping it is what
 * actually narrows the list below to the quiz's picks (see DiscoveryForm);
 * it doesn't happen on its own just because the quiz was once answered, same
 * as every other filter here staying off until the student turns it on. A
 * small edit affordance still routes to the quiz to retake it.
 */
export function PersonalizedMatchCard({ answered, active = false, onToggle }: PersonalizedMatchCardProps) {
  if (!answered) {
    return (
      <Link
        href="/student/mentors/quiz"
        className="flex items-center gap-4 rounded-lg border border-primary-light/40 bg-gradient-to-l from-secondary-soft via-primary-soft to-primary-light/30 p-4 shadow-brand transition-all duration-standard ease-gentle active:scale-[0.98] hover:border-primary-light"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-primary-foreground shadow-card">
          <SparkleIcon className="h-5 w-5" />
        </span>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body font-bold text-foreground">چند سؤال کوتاه، یه لیست دقیق</h3>
          <p className="text-caption text-muted-foreground">
            با جواب دادن به چند سؤال کوتاه و چهارگزینه‌ای، به ما کمک کن مناسب‌ترین هم‌مسیرها رو برات پیدا کنیم.
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border p-4 shadow-brand transition-all duration-standard ease-gentle",
        active
          ? "border-primary bg-gradient-to-l from-secondary-soft via-primary-soft to-primary-light/30"
          : "border-border bg-surface",
      )}
    >
      <button
        type="button"
        aria-pressed={active}
        onClick={onToggle}
        className="flex flex-1 cursor-pointer items-center gap-4 text-right active:scale-[0.98]"
      >
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-card transition-colors duration-standard ease-gentle",
            active
              ? "bg-gradient-to-br from-primary-light to-primary text-primary-foreground"
              : "bg-primary-soft text-primary",
          )}
        >
          {active ? <CheckIcon className="h-5 w-5" /> : <SparkleIcon className="h-5 w-5" />}
        </span>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body font-bold text-foreground">بهترین هم‌مسیرها برای تو</h3>
          <p className="text-caption text-muted-foreground">
            {active
              ? "لیست پایین الان بر اساس جواب‌هایی که دادی مرتب شده."
              : "بزن تا لیست پایین رو بر اساس جواب‌هایی که دادی مرتب کنیم."}
          </p>
        </div>
      </button>

      <Link
        href="/student/mentors/quiz"
        aria-label="دوباره به سؤال‌ها جواب بده"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-standard ease-gentle hover:bg-muted hover:text-foreground"
      >
        <EditIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
