/** Toast — fire-and-forget success/error banner.
 * Mounted once in the root layout — see lib/toast for how to trigger it. */
"use client";

import { useEffect, useState } from "react";
import { CheckIcon, XIcon } from "../../icons";
import { cn } from "@/lib/cn";
import { consumeStoredToast, TOAST_EVENT_NAME, type ToastPayload } from "@/lib/toast";

const AUTO_DISMISS_MS = 3000;

export function Toast() {
  const [toast, setToast] = useState<ToastPayload | null>(null);

  useEffect(() => {
    const stored = consumeStoredToast();
    if (stored) setToast(stored);

    function onEvent(e: Event) {
      setToast((e as CustomEvent<ToastPayload>).detail);
    }
    window.addEventListener(TOAST_EVENT_NAME, onEvent);
    return () => window.removeEventListener(TOAST_EVENT_NAME, onEvent);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const isSuccess = toast.kind === "success";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex justify-center px-4">
      <div
        className={cn(
          "pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-caption font-bold shadow-lifted animate-rise-in",
          isSuccess ? "bg-success text-success-foreground" : "bg-danger text-danger-foreground",
        )}
      >
        {isSuccess ? <CheckIcon className="h-4 w-4 shrink-0" /> : <XIcon className="h-4 w-4 shrink-0" />}
        {toast.message}
      </div>
    </div>
  );
}
export default Toast;
