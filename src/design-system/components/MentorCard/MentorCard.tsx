/**
 * MentorCard — the tile the site actually renders, owned by the system.
 *
 * Two layouts, one source of truth (matches the live site pixel-for-pixel):
 *   - "grid"  — compact centered tile for the two-column results grid
 *               (discover): 64px photo, name, "field، university", rank.
 *   - "strip" — teaser for the home page's horizontal strip: 80px photo,
 *               bolder teal border + lifted shadow, slightly larger type.
 *
 * Trust essentials only: photo → name → field/university → rank.
 * Bio stays off the card (lives on the profile); price lives on the
 * profile too. The whole card is the tap target — no separate CTA.
 *
 * `mentorCardClasses(layout)` is the shared container recipe: the system
 * card uses it on a <div>, the site's Next.js <Link> wrappers use it on
 * their <a> — so Storybook and hammasirsite.ir can never drift apart.
 * Rank text arrives pre-formatted (the site passes formatRankForCard);
 * the system stays formatting-agnostic.
 *
 * Status: parts are canonical (MentorTile + recipe ship via the feature
 * wrapper); this shell itself is unrendered — retire-candidate.
 */
"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
import { Avatar } from "../Avatar";

export type MentorCardLayout = "grid" | "strip";

export interface MentorCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Null/empty renders the calm "هم‌مسیر" fallback in muted text. */
  name?: string | null;
  photoUrl?: string;
  /** Pre-joined subtitle, e.g. "پزشکی، تهران" (grid) or "مهندسی کامپیوتر شریف" (strip). */
  subtitle?: string;
  /** Pre-formatted rank line, e.g. "رتبه ۱۲ کنکور ۱۴۰۳". */
  rank?: string;
  layout?: MentorCardLayout;
  onClick?: () => void;
}

/** Container recipe shared by the system card and the site Link wrappers. */
export function mentorCardClasses(
  layout: MentorCardLayout = "grid",
  opts: { clickable?: boolean } = {},
): string {
  const { clickable = true } = opts;
  return cn(
    "flex flex-col items-center text-center transition-[box-shadow,transform,background-color,border-color] duration-standard ease-gentle",
    clickable &&
      "cursor-pointer touch-manipulation active:scale-[0.99]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    layout === "grid" &&
      "w-full gap-2 rounded-card border border-border bg-surface p-4 shadow-none",
    clickable &&
      layout === "grid" &&
      "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card",
    layout === "strip" &&
      "w-52 shrink-0 snap-start gap-2.5 rounded-card border-strong border-primary-light/25 bg-surface p-5 shadow-card",
    clickable &&
      layout === "strip" &&
      "hover:-translate-y-0.5 hover:shadow-dropdown",
  );
}

/** Inner content (photo + texts) — shared by the card and site wrappers. */
export function MentorTile({
  name,
  photoUrl,
  subtitle,
  rank,
  layout = "grid",
}: Pick<MentorCardProps, "name" | "photoUrl" | "subtitle" | "rank" | "layout">) {
  const displayName = name?.trim() ? name : "هم‌مسیر";
  const named = Boolean(name?.trim());
  return (
    <>
      <Avatar name={displayName} src={photoUrl} size={layout === "strip" ? "xl" : "lg"} />
      <h3
        className={cn(
          "w-full truncate font-bold",
          layout === "strip" ? "text-body" : "text-caption",
          named ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {displayName}
      </h3>
      {subtitle && (
        <p
          className={cn(
            "w-full truncate text-muted-foreground",
            layout === "strip" ? "text-caption font-semibold" : "text-label",
          )}
        >
          {subtitle}
        </p>
      )}
      {rank && (
        <p
          className={cn(
            "w-full truncate text-action-primary",
            layout === "strip" ? "text-caption font-bold" : "text-label font-semibold",
          )}
        >
          {rank}
        </p>
      )}
    </>
  );
}

export function MentorCard({
  name,
  photoUrl,
  subtitle,
  rank,
  layout = "grid",
  onClick,
  className,
  onKeyDown,
  ...props
}: MentorCardProps) {
  const clickable = !!onClick;
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(e);
    if (!clickable || e.defaultPrevented) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  }
  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={name?.trim() ? `مشاهده پروفایل ${name}` : "مشاهده پروفایل این هم‌مسیر"}
      className={cn(mentorCardClasses(layout, { clickable }), className)}
      {...props}
    >
      <MentorTile name={name} photoUrl={photoUrl} subtitle={subtitle} rank={rank} layout={layout} />
    </div>
  );
}

export default MentorCard;
