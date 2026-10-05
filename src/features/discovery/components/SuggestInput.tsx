"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/design-system";
import { SearchIcon } from "@/design-system";
import { cn } from "@/lib/cn";

interface SuggestInputProps {
  value: string;
  onChange: (value: string) => void;
  /** The full suggestion list (e.g. every field of study for the selected track) — shown as soon as the input is focused, filtered as the student types. */
  suggestions: string[];
  placeholder?: string;
}

/**
 * A free-text input that shows a dropdown of suggestions on click/focus —
 * the full list at first, narrowing as the student types, but never
 * blocking free text: they can always keep typing something not on the list.
 * The blur handler is delayed so a click on a suggestion registers first.
 *
 * The dropdown is portaled to document.body and positioned with fixed
 * coordinates from the input's own bounding rect — several ancestors on the
 * discovery form (the per-section "animate-rise-in" wrappers) carry a CSS
 * animation, which per spec pins them to their own stacking context forever
 * (even once the animation has finished), so a merely-high z-index on an
 * absolutely-positioned dropdown nested inside one section can still end up
 * painted under a later sibling section. Portaling sidesteps that entirely.
 */
export function SuggestInput({ value, onChange, suggestions, placeholder }: SuggestInputProps) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function updateRect() {
      const el = wrapperRef.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      setRect({ top: box.bottom + 4, left: box.left, width: box.width });
    }
    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const query = value.trim();
    if (!query) return suggestions;
    return suggestions.filter((s) => s.includes(query));
  }, [suggestions, value]);

  const showDropdown = open && filtered.length > 0 && rect;

  return (
    <div ref={wrapperRef} className="relative">
      <SearchIcon className="pointer-events-none absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        className="pr-11"
        value={value}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onChange={(e) => onChange(e.target.value)}
      />
      {mounted &&
        showDropdown &&
        createPortal(
          <ul
            style={{ position: "fixed", top: rect.top, left: rect.left, width: rect.width }}
            className="z-50 max-h-56 overflow-y-auto rounded-md border border-border bg-surface py-1 shadow-lifted"
          >
            {filtered.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(suggestion);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center px-3.5 py-2.5 text-right text-sm text-foreground transition-colors duration-standard ease-gentle hover:bg-primary-soft hover:text-primary",
                  )}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
