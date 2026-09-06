"use client";

import Link from "next/link";
import { formatRankForCard } from "@/lib/format";
import { trackClick } from "@/lib/analyticsClient";
import type { Mentor } from "@/lib/mentors";
import { MentorAvatar } from "./MentorAvatar";

interface MentorCardProps {
  mentor: Mentor;
  /** The /student/mentors query string this card is shown under — forwarded as `back` so the profile page's back button (and the booking flow beyond it) can return to these exact results. */
  queryString?: string;
}

/**
 * A compact, centered tile for the two-column results grid — photo, name,
 * field + university, and rank (which already carries the acceptance year).
 * No price here; that only lives on the profile now. The whole card is the
 * tap target.
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
      className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg bg-surface p-4 text-center shadow-card transition-all duration-standard ease-gentle hover:-translate-y-0.5 hover:shadow-lifted active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <MentorAvatar photo={photo} name={name} size={64} />

      <h3
        className={
          name
            ? "truncate text-caption font-bold text-foreground"
            : "truncate text-caption font-bold text-muted-foreground"
        }
      >
        {name ?? "هم‌مسیر"}
      </h3>

      {subtitle && <p className="truncate text-label text-muted-foreground">{subtitle}</p>}

      {rank && <p className="truncate text-label font-semibold text-primary">{formatRankForCard(rank)}</p>}
    </Link>
  );
}
