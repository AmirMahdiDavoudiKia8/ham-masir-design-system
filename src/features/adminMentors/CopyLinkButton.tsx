"use client";

import { useState } from "react";

/** Copies one mentor's profile URL — the thing the founder actually pastes into a chat or bio. */
export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked (non-HTTPS, permissions) — the URL is still visible and selectable next to the button.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="shrink-0 rounded-md border border-border bg-surface px-3 py-1.5 text-label font-bold text-foreground hover:bg-surface-alt"
    >
      {copied ? "کپی شد ✓" : "کپی لینک"}
    </button>
  );
}
