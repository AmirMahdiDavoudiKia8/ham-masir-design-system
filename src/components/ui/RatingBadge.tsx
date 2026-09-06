import { StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";

interface RatingBadgeProps {
  rating: number;
  className?: string;
}

/** Compact "★ ۴.۸" badge for right next to a mentor's name — MentorReviews shows the fuller rating + review-count breakdown where there's more room. */
export function RatingBadge({ rating, className }: RatingBadgeProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 text-caption font-bold text-secondary-dark", className)}>
      <StarIcon filled className="h-3.5 w-3.5" />
      {toPersianDigits(rating.toFixed(1))}
    </span>
  );
}
