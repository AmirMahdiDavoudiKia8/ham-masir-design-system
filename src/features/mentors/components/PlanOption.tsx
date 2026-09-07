import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface PlanOptionProps {
  title: string;
  subtitle: string;
  price?: string;
  /** Rendered next to the price — the site charges nothing up front, so the price alone would read as "due now" without it. */
  priceNote?: string;
  note?: string;
  selected: boolean;
  onClick: () => void;
}

/**
 * Single-select plan card. Both plans render with identical visual weight —
 * this is meant to read as a calm choice, not a nudge toward one option.
 */
export function PlanOption({ title, subtitle, price, priceNote, note, selected, onClick }: PlanOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full cursor-pointer items-start gap-3 rounded-lg border-2 p-4 text-right transition-all duration-standard ease-gentle active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        selected ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-primary-light",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-standard ease-gentle",
          selected ? "border-primary bg-primary" : "border-border bg-surface",
        )}
      >
        {selected && <CheckIcon className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-caption font-bold text-foreground">{title}</span>
        <span className="mt-1 block text-label leading-relaxed text-muted-foreground">{subtitle}</span>
        {price ? (
          <span className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-caption font-bold text-primary">{price}</span>
            {priceNote && <span className="text-label font-semibold text-muted-foreground">{priceNote}</span>}
          </span>
        ) : (
          <span className="mt-2 block text-label font-semibold text-muted-foreground">
            به‌زودی قیمت‌گذاری می‌شود
          </span>
        )}
        {note && <span className="mt-2 block text-label font-semibold text-secondary-dark">{note}</span>}
      </span>
    </button>
  );
}
