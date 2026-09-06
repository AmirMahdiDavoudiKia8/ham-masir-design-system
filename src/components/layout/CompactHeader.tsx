import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

interface CompactHeaderProps {
  title: string;
  backHref?: string;
}

/**
 * Compact header for secondary screens (results, profile, ...): a back
 * action plus a page title, sharing the root Header's sticky/blur treatment
 * without repeating its brand mark.
 */
export function CompactHeader({ title, backHref = "/student/discover" }: CompactHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-1 border-b border-border/70 bg-surface/90 px-2 backdrop-blur-md">
      <Link
        href={backHref}
        aria-label="بازگشت"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors duration-standard ease-gentle hover:bg-muted active:scale-95"
      >
        <ArrowRightIcon className="h-5 w-5" />
      </Link>
      <h1 className="flex-1 truncate text-center text-h3 font-semibold text-foreground">
        {title}
      </h1>
      {/* Brand/logo slot — intentionally left empty until final branding is
          provided; do not add a logo, brand text, or brand mark here.
          Sized to match the back button so the title stays centered. */}
      <span aria-hidden className="h-11 w-11 shrink-0" />
    </header>
  );
}
