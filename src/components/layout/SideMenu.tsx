"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/navigation/BottomNav";
import { BookIcon, MenuIcon, XIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { SITE_LEGAL_LINKS } from "@/lib/siteLinks";

/** The library has no bottom-nav tab (see BottomNav's NAV_ITEMS doc comment) — a plain `<a>` since it's a static file, not a Next.js route. */
const LIBRARY_LINK = {
  key: "library",
  label: "سالن مطالعه",
  // Next.js's public/ folder has no directory-index resolution — /library
  // and /library/ both 404, only the exact file path works.
  href: "/library/index.html",
  Icon: BookIcon,
};

/**
 * Hamburger trigger + slide-in side drawer, mounted in the root Header on
 * every primary tab screen. Lists the same four destinations as the bottom
 * nav (NAV_ITEMS, shared rather than re-declared) plus the library link,
 * which has nowhere else to live — the bottom nav is deliberately capped at
 * four tabs, so a fifth destination goes here instead of crowding it.
 */
export function SideMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // The trigger button lives inside <header>, which has backdrop-blur-md —
  // a backdrop-filter on an ancestor creates a new CSS containing block for
  // any `position: fixed` descendant, trapping it inside that ancestor's own
  // box instead of the viewport. The drawer itself is portaled straight to
  // <body> to escape that (same reason SupportFab is mounted at the root
  // layout rather than nested under a page's header). Mounting is deferred
  // to an effect since document.body doesn't exist during SSR.
  useEffect(() => setMounted(true), []);

  // The drawer is a modal surface, so the page behind it must not scroll —
  // otherwise a swipe anywhere outside the panel scrolls the page underneath
  // and the student comes back to a screen that moved on its own. Same
  // mechanism (and same restore-the-previous-value care) as BottomSheet.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Esc closes it, like any other modal surface on the site.
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
  }

  const drawer = (
    <>
      {open && (
        <button
          type="button"
          aria-label="بستن منو"
          onClick={close}
          className="fixed inset-0 z-40 cursor-default bg-scrim"
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label="منو"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col bg-surface shadow-lifted transition-transform duration-standard ease-gentle",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <span className="text-h3 font-bold text-foreground">منو</span>
          <button
            type="button"
            aria-label="بستن منو"
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-standard ease-gentle hover:bg-muted"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map(({ key, label, href, matches, Icon }) => {
            const isActive = matches.some((prefix) => pathname.startsWith(prefix));
            return (
              <Link
                key={key}
                href={href}
                onClick={close}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 transition-colors duration-standard ease-gentle hover:bg-muted",
                  isActive && "bg-primary-soft/60",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className={cn("text-body font-bold", isActive ? "text-primary" : "text-foreground")}>
                  {label}
                </span>
              </Link>
            );
          })}

          <div className="my-2 border-t border-border" />

          <a
            href={LIBRARY_LINK.href}
            onClick={close}
            className="flex items-center gap-3 rounded-md px-3 py-3 transition-colors duration-standard ease-gentle hover:bg-muted"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <LIBRARY_LINK.Icon className="h-[18px] w-[18px]" />
            </span>
            <span className="flex flex-col">
              <span className="text-body font-bold text-foreground">{LIBRARY_LINK.label}</span>
              <span className="text-caption text-muted-foreground">جمع بندی و نکات شیمی کنکور</span>
            </span>
          </a>

          <div className="my-2 border-t border-border" />

          {SITE_LEGAL_LINKS.map(({ key, label, href, Icon }) => (
            <Link
              key={key}
              href={href}
              onClick={close}
              className="flex items-center gap-3 rounded-md px-3 py-3 transition-colors duration-standard ease-gentle hover:bg-muted"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-body font-bold text-foreground">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        aria-label="منو"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors duration-standard ease-gentle hover:bg-muted active:scale-95"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
