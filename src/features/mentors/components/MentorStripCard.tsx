import Link from "next/link";
import type { Mentor } from "@/lib/mentors";
import { formatRankForCard } from "@/lib/format";
import { MentorAvatar } from "./MentorAvatar";

interface MentorStripCardProps {
  mentor: Mentor;
}

/**
 * Tile for the horizontally-scrolling "featured هم‌مسیرها" strip on the
 * home page — a face, a "{رشته} {دانشگاه}" line (e.g. "مهندسی کامپیوتر
 * شریف"), and a small rank/year stamp in front of the student before they
 * tap through to the full list. Bolder border + shadow than MentorCard so
 * it reads as a standalone teaser card rather than a grid tile.
 */
export function MentorStripCard({ mentor }: MentorStripCardProps) {
  const { id, name, photo, field, university, rank } = mentor;
  const subtitle = [field, university].filter(Boolean).join(" ");

  return (
    <Link
      href={`/student/mentors/${id}`}
      aria-label={name ? `مشاهده پروفایل ${name}` : "مشاهده پروفایل این هم‌مسیر"}
      className="flex w-52 shrink-0 snap-start flex-col items-center gap-2.5 rounded-lg border-2 border-primary-light/25 bg-surface p-5 text-center shadow-lifted transition-all duration-standard ease-gentle hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <MentorAvatar photo={photo} name={name} size={80} />

      <h3 className="truncate text-body font-bold text-foreground">{name ?? "هم‌مسیر"}</h3>

      {subtitle && (
        <p className="truncate text-caption font-semibold text-muted-foreground">{subtitle}</p>
      )}

      {rank && (
        <p className="truncate text-caption font-bold text-primary">{formatRankForCard(rank)}</p>
      )}
    </Link>
  );
}
