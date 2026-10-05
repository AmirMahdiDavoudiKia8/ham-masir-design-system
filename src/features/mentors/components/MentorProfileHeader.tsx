import Link from "next/link";
import { ArrowRightIcon } from "@/design-system";

interface MentorProfileHeaderProps {
  backHref: string;
}

/**
 * Back control only, floating over the gradient banner behind it (see the
 * profile page, which renders this absolutely inside a `relative` banner
 * block) — never a title bar, since the identity block below is the title.
 * The back button gets its own white backdrop rather than the header
 * having one, since the header itself has to stay transparent for the
 * banner to show through.
 */
export function MentorProfileHeader({ backHref }: MentorProfileHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between px-3">
      <Link
        href={backHref}
        aria-label="بازگشت به نتایج"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-card backdrop-blur-md transition-colors duration-standard ease-gentle hover:bg-surface active:scale-95"
      >
        <ArrowRightIcon className="h-5 w-5" />
      </Link>
      <span aria-hidden className="h-10 w-10 shrink-0" />
    </header>
  );
}
