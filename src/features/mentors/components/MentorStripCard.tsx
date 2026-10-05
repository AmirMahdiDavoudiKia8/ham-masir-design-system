import Link from "next/link";
import type { Mentor } from "@/lib/mentors";
import { formatRankForCard } from "@/lib/format";
import { mentorCardClasses, MentorTile } from "@/design-system";

interface MentorStripCardProps {
  mentor: Mentor;
}

/**
 * Teaser tile for the home page's horizontal "featured هم‌مسیرها" strip.
 * Visuals come from the design system's MentorCard (layout="strip") —
 * this wrapper only adds the profile Link and Mentor → tile field
 * mapping. If it ever looks different from Storybook, that's a bug.
 */
export function MentorStripCard({ mentor }: MentorStripCardProps) {
  const { id, name, photo, field, university, rank } = mentor;
  const subtitle = [field, university].filter(Boolean).join(" ");

  return (
    <Link
      href={`/student/mentors/${id}`}
      aria-label={name ? `مشاهده پروفایل ${name}` : "مشاهده پروفایل این هم‌مسیر"}
      className={mentorCardClasses("strip")}
    >
      <MentorTile
        name={name}
        photoUrl={photo ?? undefined}
        subtitle={subtitle || undefined}
        rank={rank ? formatRankForCard(rank) : undefined}
        layout="strip"
      />
    </Link>
  );
}
