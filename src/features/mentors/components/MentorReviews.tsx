import { AccompaniedLineIcon, StarIcon } from "@/design-system";
import type { Mentor } from "@/lib/mentors";
import { toPersianDigits } from "@/lib/format";

interface MentorReviewsProps {
  mentor: Mentor;
}

/**
 * Canon A.3: the written review leads, the number only supports it — never
 * a headline. Each review reads like a short letter, not a scored row; the
 * small rating stamp sits quietly under the text, next to who wrote it.
 * Empty state is warm and hopeful, never "۰ نظر" as a verdict.
 */
export function MentorReviews({ mentor }: MentorReviewsProps) {
  const { reviews, rating, reviewsCount } = mentor;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-h2 font-bold text-foreground">تجربه‌ی بقیه</h2>
        {rating != null && (
          <div className="flex items-center gap-1 text-caption text-muted-foreground">
            <StarIcon filled className="h-3.5 w-3.5 text-secondary-dark" />
            <span className="font-bold text-foreground">{toPersianDigits(rating.toFixed(1))}</span>
            {reviewsCount != null && <span>({toPersianDigits(reviewsCount)})</span>}
          </div>
        )}
      </div>

      {reviews && reviews.length > 0 ? (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-lg border border-border bg-surface p-5 shadow-card">
              <p className="text-body text-foreground">{review.text}</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
                <span className="text-caption text-muted-foreground">{review.authorLabel}</span>
                <span className="flex items-center gap-1 text-label text-muted-foreground">
                  <StarIcon filled className="h-3 w-3 text-secondary-dark" />
                  {toPersianDigits(review.rating)}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface-alt px-6 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <AccompaniedLineIcon className="h-6 w-6" />
          </span>
          <p className="max-w-[22rem] text-caption text-muted-foreground">
            هنوز کسی تجربه‌ش رو اینجا ننوشته، شاید تو اولین نفری باشی که بعد از این گفت‌وگو چیزی برای گفتن داشته باشه.
          </p>
        </div>
      )}
    </section>
  );
}
