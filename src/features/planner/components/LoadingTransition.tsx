"use client";

import { useEffect, useState } from "react";

interface LoadingTransitionProps {
  onDone: () => void;
}

const MESSAGES = ["داریم ضرایبت رو حساب می‌کنیم...", "داریم برنامه‌ت رو می‌چینیم..."];
const MESSAGE_INTERVAL_MS = 900;
const TOTAL_DURATION_MS = 1800;

/**
 * Brand-motif loading state between the form and the result page — two
 * parallel lines that ease toward each other (echoing the logo's "The
 * Accompanied Line") instead of a generic spinner, with the message
 * swapping once partway through so the wait reads as "computing", not stuck.
 */
export function LoadingTransition({ onDone }: LoadingTransitionProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageTimer = setTimeout(() => setMessageIndex(1), MESSAGE_INTERVAL_MS);
    const doneTimer = setTimeout(onDone, TOTAL_DURATION_MS);
    return () => {
      clearTimeout(messageTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="relative flex h-16 w-24 items-center justify-center">
        <span className="planner-loading-line planner-loading-line--primary" />
        <span className="planner-loading-line planner-loading-line--secondary" />
      </div>
      <p key={messageIndex} className="text-body font-semibold text-foreground animate-rise-in">
        {MESSAGES[messageIndex]}
      </p>
    </div>
  );
}
