"use client";

const STORAGE_KEY = "hammasir_toast";
const EVENT_NAME = "hammasir:toast";

export type ToastKind = "success" | "error";

export interface ToastPayload {
  message: string;
  kind: ToastKind;
}

/**
 * Fire-and-forget success/error banner, shown by the single <Toast/> mounted
 * in the root layout. Works both for same-page triggers (login/register —
 * dispatches a live event the mounted Toast picks up instantly) and
 * across-navigation ones (logout redirects to /student/home first — the
 * message is also parked in sessionStorage, which the freshly-mounted Toast
 * reads once on load).
 */
export function showToast(message: string, kind: ToastKind = "success") {
  const payload: ToastPayload = { message, kind };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // best-effort only
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }));
}

export function consumeStoredToast(): ToastPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    return JSON.parse(raw) as ToastPayload;
  } catch {
    return null;
  }
}

export { EVENT_NAME as TOAST_EVENT_NAME };
