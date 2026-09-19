"use client";

import { useEffect, useState } from "react";

interface EnablePushButtonProps {
  /** VAPID public key, handed down from the server at request time — undefined means push isn't configured on this server yet. */
  vapidPublicKey?: string;
}

type Status = "checking" | "unsupported" | "ios-needs-install" | "denied" | "off" | "working" | "on" | "error";

const SW_URL = "/mentor/admin/push-sw.js";
const SW_SCOPE = "/mentor/admin/";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * Turns on "a notification on my phone for every signup" for the device it's
 * pressed on (see lib/adminNotify). Pressing it again re-sends the test push,
 * which doubles as "is this still working?".
 *
 * iPhone is the awkward case: Safari only allows web push for a site that has
 * been added to the Home Screen and opened from there (iOS 16.4+). Rather
 * than a button that silently does nothing, it says exactly that.
 */
export function EnablePushButton({ vapidPublicKey }: EnablePushButtonProps) {
  const [status, setStatus] = useState<Status>("checking");
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    (async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus(isIos() && !isStandalone() ? "ios-needs-install" : "unsupported");
        return;
      }
      if (Notification.permission === "denied") return setStatus("denied");
      const reg = await navigator.serviceWorker.getRegistration(SW_SCOPE);
      const sub = await reg?.pushManager.getSubscription();
      setStatus(sub ? "on" : "off");
    })().catch(() => setStatus("off"));
  }, []);

  async function enable() {
    if (!vapidPublicKey) return;
    setStatus("working");
    setMessage(undefined);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE });
      await navigator.serviceWorker.ready;
      const subscription =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
        }));

      const res = await fetch("/api/admin/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "failed");
      setStatus("on");
      setMessage(data.delivered > 0 ? "یه نوتیف تست فرستادم — باید همین الان روی این دستگاه ببینیش." : undefined);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : String(err));
    }
  }

  if (!vapidPublicKey) {
    return <Box>نوتیف روی سرور هنوز تنظیم نشده.</Box>;
  }
  if (status === "checking") return null;
  if (status === "ios-needs-install") {
    return (
      <Box>
        برای نوتیف روی آیفون: همین صفحه رو توی Safari با دکمه‌ی Share → «Add to Home Screen» به صفحه‌ی اصلی اضافه کن، از
        همون آیکون بازش کن و دوباره بیا اینجا.
      </Box>
    );
  }
  if (status === "unsupported") return <Box>این مرورگر نوتیف وب رو پشتیبانی نمی‌کنه (Chrome یا Safari رو امتحان کن).</Box>;
  if (status === "denied") {
    return <Box>اجازه‌ی نوتیف برای این سایت بسته شده. از تنظیمات مرورگر برای hammasirsite.ir بازش کن و دوباره بیا.</Box>;
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-surface p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-caption font-bold text-foreground">
          {status === "on" ? "🔔 نوتیف روی این دستگاه روشنه" : "🔕 نوتیف ثبت‌نام‌ها روی این دستگاه خاموشه"}
        </span>
        <button
          type="button"
          onClick={enable}
          disabled={status === "working"}
          className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-label font-bold text-white disabled:opacity-50"
        >
          {status === "working" ? "صبر کن…" : status === "on" ? "ارسال تست" : "روشن کن"}
        </button>
      </div>
      {message && <p className="text-label text-muted-foreground">{message}</p>}
    </div>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-border bg-surface-alt p-3 text-caption text-muted-foreground">{children}</p>;
}
