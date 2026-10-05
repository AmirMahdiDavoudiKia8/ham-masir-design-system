"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageview } from "@/lib/analyticsClient";

/** Mounted once in the root layout — fires a pageview on first load and every client-side route change (App Router doesn't full-reload between tabs, so this has to watch the pathname itself rather than relying on a page-level effect). */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);

  return null;
}
