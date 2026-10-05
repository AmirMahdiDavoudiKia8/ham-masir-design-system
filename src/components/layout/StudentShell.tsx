import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StudentShellProps {
  children: ReactNode;
  /**
   * The tab bar, when this segment has one to show. Left undefined for the
   * pre-onboarding flow (entry/auth/onboarding) — there's no "دیگر تب‌ها"
   * to jump to yet since the student hasn't answered the intake quiz or
   * picked a هم‌مسیر, so no nav renders and no bottom space is reserved for it.
   */
  nav?: ReactNode;
}

/**
 * Shared page chrome for every /student/* screen: mobile stays a plain
 * full-width column; from md up, the column widens progressively (rather
 * than jumping straight to a fixed max-w-md) so a laptop-width window gets
 * real use of the space — grids inside (MentorList, MentorStripCard's
 * strip, etc.) pick up more columns at the same breakpoints — instead of
 * just floating the phone-width layout in a sea of empty gradient.
 */
export function StudentShell({ children, nav }: StudentShellProps) {
  return (
    <div className="min-h-dvh bg-background md:bg-gradient-to-br md:from-primary-soft md:via-background md:to-secondary-soft">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background md:max-w-2xl lg:max-w-4xl xl:max-w-5xl md:border-x md:border-border md:shadow-lifted">
        <main className={cn("flex-1", Boolean(nav) && "pb-24")}>{children}</main>
        {nav}
      </div>
    </div>
  );
}
