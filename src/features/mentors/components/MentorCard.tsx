"use client";

import Link from "next/link";
import { formatRankForCard } from "@/lib/format";
import { trackClick } from "@/lib/analyticsClient";
import type { Mentor } from "@/lib/mentors";
import { mentorCardClasses, MentorTile } from "@/design-system";

interface MentorCardProps {
  mentor: Mentor;
  /** The /student/mentors query string this card is shown under — forwarded as `back` so the profile page's back button (and the booking flow beyond it) can return to these exact results. */
  queryString?: string;
}

/**
 * Compact tile for the two-column results grid. Visuals come from the
 * design system's MentorCard (layout="grid") — this wrapper only adds
 * app concerns: the profile Link, click tracking, and Mentor → tile
 * field mapping. If it ever looks different from Storybook, that's a bug.
 */
export function MentorCard({ mentor, queryString }: MentorCardProps) {
  const { id, name, photo, field, university, rank } = mentor;

  const subtitle = [field, university].filter(Boolean).join("، ");
  const href = `/student/mentors/${id}${queryString ? `?back=${encodeURIComponent(queryString)}` : ""}`;

  return (
    <Link
      href={href}
      onClick={() => trackClick("/student/mentors", "mentor_card")}
      aria-label={name ? `مشاهده پروفایل ${name}` : "مشاهده پروفایل این هم‌مسیر"}
      className={mentorCardClasses("grid")}
    >
      <MentorTile
        name={name}
        photoUrl={photo ?? undefined}
        subtitle={subtitle || undefined}
        rank={rank ? formatRankForCard(rank) : undefined}
        layout="grid"
      />
    </Link>
  );
}
