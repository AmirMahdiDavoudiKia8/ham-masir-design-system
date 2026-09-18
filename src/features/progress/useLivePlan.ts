"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** How often an open, visible progress page re-reads the server-side plan. */
const POLL_MS = 20_000;

/**
 * Keeps a progress page that's just sitting open in sync with the plan the
 * mentor is writing in the portal right now. The page itself is already
 * uncached — every request re-reads the student's file — so a reload always
 * showed the newest plan; what it couldn't do was notice a change while the
 * student was looking at it. Sessions are often booked and planned while the
 * two are on the phone together, so "she'll see it after a refresh" is the
 * wrong answer at exactly the moment it matters.
 *
 * router.refresh() re-renders the server component and diffs it in — no full
 * reload, so scroll position, the selected day and any open panel survive.
 *
 * Deliberately cheap, because this runs against a 1 vCPU box: only while the
 * tab is actually visible (a backgrounded tab polls nothing), and once
 * immediately when it becomes visible again, which covers the common case of
 * coming back to a tab left open for hours. `enabled` is false for the demo
 * plan, which has no server counterpart to poll for.
 *
 * `paused` holds off while a tick is mid-flight — that action refreshes on
 * its own when it lands, and a poll landing in between would briefly render
 * the pre-tick value over it.
 */
export function useLivePlan(enabled: boolean, paused: boolean) {
  const router = useRouter();
  // Kept in a ref so changing it doesn't tear down and restart the interval.
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    if (!enabled) return;

    function refreshIfIdle() {
      if (!pausedRef.current && document.visibilityState === "visible") router.refresh();
    }

    const timer = setInterval(refreshIfIdle, POLL_MS);
    document.addEventListener("visibilitychange", refreshIfIdle);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshIfIdle);
    };
  }, [enabled, router]);
}
