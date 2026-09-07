import { CheckIcon, ClockIcon, CoinIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * The site's central promise, in one place: nothing is paid to reserve a
 * session — the student pays afterwards, and only if the session was worth
 * it. It's the single biggest reason to trust a stranger with a konkur
 * year, so it can't live only on the booking screen; every surface where a
 * student weighs "should I actually do this?" (home, mentor plans, time
 * picking, reservation, confirmation) renders one of these variants, and
 * they all read the same words from here so the promise can never drift
 * between screens.
 *
 * Deliberately not an urgency device (brand §9): no pulsing, no countdown,
 * no "فقط امروز". The peach/teal pairing is the same reassurance family the
 * home page already gives its guarantee step — warmth, not alarm.
 */

export const PAY_AFTER_HEADLINE = "اول جلسه، بعد پرداخت";
export const PAY_AFTER_TAGLINE = "و فقط اگه راضی بودی.";
export const PAY_AFTER_SHORT = "پرداخت بعد از جلسه — فقط اگه راضی بودی";

const points = [
  { Icon: CoinIcon, label: "برای رزرو، صفر تومان" },
  { Icon: ClockIcon, label: "بعد از جلسه تصمیم می‌گیری" },
  { Icon: ShieldCheckIcon, label: "راضی نبودی، چیزی نمی‌دی" },
];

interface PayAfterPromiseProps {
  className?: string;
}

/** Full-width statement card — for the places a student is still deciding whether to start at all (home, mentor plans). */
export function PayAfterPromise({ className }: PayAfterPromiseProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-lg border-2 border-secondary bg-gradient-to-bl from-secondary-soft via-cream to-primary-soft p-5 shadow-brand",
        className,
      )}
    >
      {/* Soft halo, purely decorative — keeps the card from reading as a flat alert box. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-12 h-36 w-36 rounded-full bg-primary-soft/70 blur-2xl"
      />

      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface text-primary shadow-card">
            <ShieldCheckIcon className="h-6 w-6" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h2 className="text-h2 font-bold leading-tight text-foreground">{PAY_AFTER_HEADLINE}</h2>
            <p className="text-body font-bold text-secondary-foreground">{PAY_AFTER_TAGLINE}</p>
          </div>
        </div>

        <p className="text-caption leading-[1.9] text-secondary-foreground/85">
          برای رزرو جلسه هیچ پولی ازت نمی‌گیریم. اول با هم‌مسیرت می‌شینی و حرف می‌زنی؛ بعدش، اگه واقعاً به کارت
          اومد حساب می‌کنی. اگه نیومد، هیچی بدهکار نیستی — نه سؤالی، نه شرطی.
        </p>

        <ul className="flex flex-col gap-2 border-t border-secondary/50 pt-3">
          {points.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface/80 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-caption font-bold text-foreground">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** One-line version — for screens already deep in the flow, where the promise is a reminder rather than the pitch. */
export function PayAfterBanner({ className }: PayAfterPromiseProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border-2 border-secondary bg-secondary-soft px-4 py-3.5",
        className,
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-primary shadow-card">
        <ShieldCheckIcon className="h-[18px] w-[18px]" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-caption font-bold text-foreground">
          {PAY_AFTER_HEADLINE} — {PAY_AFTER_TAGLINE}
        </p>
        <p className="text-label leading-relaxed text-secondary-foreground/85">
          الان چیزی پرداخت نمی‌کنی. بعد از جلسه، اگه به کارت اومد حساب می‌کنی.
        </p>
      </div>
    </div>
  );
}

/** Quietest form — a single reassurance line for plan cards and sticky bars, where a card would crowd the layout. */
export function PayAfterNote({ className }: PayAfterPromiseProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-label font-bold text-secondary-foreground", className)}>
      <CheckIcon className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.5} />
      {PAY_AFTER_SHORT}
    </span>
  );
}
