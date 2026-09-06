"use client";

import { useState } from "react";
import { ChatIcon, XIcon } from "@/components/ui/icons";
import { SITE_CONTACTS } from "@/lib/siteLinks";

/**
 * Site-wide floating support entry point — mounted once in the root layout
 * so it's fixed to the viewport's bottom-right corner on every screen
 * (guest and app both), independent of whichever page chrome (BottomNav,
 * other floating CTAs like the home page's "join the team" bar) happens to
 * be present. z-50 keeps it above all of them.
 */
export function SupportFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="بستن"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 cursor-default"
        />
      )}

      <div className="fixed bottom-40 right-4 z-50 flex flex-col items-end gap-3">
        {open && (
          <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-2 shadow-lifted animate-rise-in">
            {SITE_CONTACTS.map(({ key, label, detail, href, Icon }) => (
              <a
                key={key}
                href={href}
                target={key === "phone" ? undefined : "_blank"}
                rel={key === "phone" ? undefined : "noopener noreferrer"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors duration-standard ease-gentle hover:bg-muted"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="flex flex-col items-start">
                  <span className="text-caption font-bold text-foreground">{label}</span>
                  <span dir="ltr" className="text-label text-muted-foreground">
                    {detail}
                  </span>
                </span>
              </a>
            ))}
          </div>
        )}

        <button
          type="button"
          aria-label={open ? "بستن پشتیبانی" : "پشتیبانی"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-l from-primary-hover to-primary text-primary-foreground shadow-brand transition-all duration-standard ease-gentle active:scale-95"
        >
          {open ? <XIcon className="h-6 w-6" /> : <ChatIcon className="h-6 w-6" />}
        </button>
      </div>
    </>
  );
}
