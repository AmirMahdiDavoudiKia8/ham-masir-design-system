"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  HomeIcon,
  ProfileIcon,
  ProgressIcon,
  UsersIcon,
  type IconProps,
} from "@/components/ui/icons";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  matches: string[];
  Icon: (props: IconProps) => React.JSX.Element;
}

/**
 * Each tab matches its own route plus everything downstream of it (e.g.
 * "search" stays lit through the mentor list and the booking flow) — a
 * request path can start with more than one of these, so order matters:
 * the first (longest/most specific) match wins. Exported as NAV_ITEMS so
 * SideMenu can list the same four destinations instead of hand-duplicating
 * them (plus its own library link, which has no bottom-nav tab).
 */
export const NAV_ITEMS: NavItem[] = [
  {
    key: "home",
    label: "خانه",
    href: "/student/home",
    matches: ["/student/home"],
    Icon: HomeIcon,
  },
  {
    key: "search",
    label: "هم‌مسیرها",
    href: "/student/discover",
    matches: ["/student/discover", "/student/mentors", "/student/booking"],
    Icon: UsersIcon,
  },
  {
    key: "progress",
    label: "پیشرفت",
    href: "/student/progress",
    matches: ["/student/progress"],
    Icon: ProgressIcon,
  },
  {
    key: "profile",
    label: "پروفایل",
    href: "/student/profile",
    matches: ["/student/profile"],
    Icon: ProfileIcon,
  },
];

/**
 * Fixed bottom navigation, floating above the bottom edge rather than flush
 * against it — a full-bleed edge-to-edge bar reads oddly on a wide desktop
 * browser window since the actual content is capped at max-w-md and
 * centered, but the bar's background used to span the whole viewport width.
 * Active tab is derived from the real route — Progress/Profile point at
 * screens that don't exist yet and will 404 until they're built, same as
 * any other TODO route in this app.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
      <ul className="mx-auto flex w-full max-w-md items-stretch justify-between rounded-full border border-border/70 bg-surface/95 px-3 py-1.5 shadow-nav backdrop-blur-md">
        {NAV_ITEMS.map(({ key, label, href, matches, Icon }) => {
          const isActive = matches.some((prefix) => pathname.startsWith(prefix));
          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className="flex w-full cursor-pointer flex-col items-center gap-1 py-1.5 text-xs transition-colors duration-standard ease-gentle focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "flex h-9 w-12 items-center justify-center rounded-full transition-all duration-standard ease-gentle",
                    isActive ? "bg-primary-soft text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-[22px] w-[22px]" />
                </span>
                <span className={cn("font-semibold", isActive ? "text-primary" : "text-muted-foreground")}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
