/**
 * Sheet — generic bottom sheet: dimmed scrim, slide-up panel,
 * drag-down-to-dismiss handle, and a close button. Stays mounted
 * (translated off-screen) while closed so the closing animation can play
 * instead of just vanishing. Portals to document.body so `position: fixed`
 * can't be trapped by an ancestor's transform (e.g. the page's rise-in
 * animations).
 */
"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { XIcon } from "../../icons";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel: string;
}

const DRAG_CLOSE_THRESHOLD = 110;

export function Sheet({ open, onClose, children, ariaLabel }: SheetProps) {
  const [mounted, setMounted] = useState(false);
  const [dragY, setDragY] = useState(0);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setDragY(0);
  }, [open]);

  if (!mounted) return null;

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    startYRef.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    setDragY(Math.max(0, e.clientY - startYRef.current));
  }

  function handlePointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (dragY > DRAG_CLOSE_THRESHOLD) {
      onClose();
    }
    setDragY(0);
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-sheet ease-gentle",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-scrim" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          "relative flex max-h-[88vh] w-full max-w-md flex-col rounded-t-sheet border-x border-t border-border bg-surface shadow-sheet transition-transform duration-sheet ease-gentle",
          open ? "translate-y-0" : "translate-y-full",
        )}
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: "none" } : undefined}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex shrink-0 cursor-grab touch-none items-center justify-center py-3 active:cursor-grabbing"
        >
          <span aria-hidden className="h-1.5 w-10 rounded-full bg-border" />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="بستن"
          className="absolute left-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-standard ease-gentle hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          <XIcon className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+20px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
export default Sheet;
