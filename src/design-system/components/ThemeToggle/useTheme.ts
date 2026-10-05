/**
 * useTheme — Ham-Masir mood state ("day walk" / "night walk").
 *
 * - Reads persisted choice from localStorage (`hammasir-theme`), falls back to
 *   `prefers-color-scheme` on first visit.
 * - Flips ONLY the `.dark` class on <html>, so the semantic token layer flips
 *   and every component re-skins with no code changes.
 * - Never flashes: initial state resolves on mount; pair with a blocking
 *   inline script in app/layout.tsx if you need pre-paint accuracy.
 */
"use client";
import * as React from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "hammasir-theme";

function resolveInitial(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* private mode — fall through to OS preference */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setThemeState] = React.useState<Theme>("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setThemeState(resolveInitial());
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore write failures */
    }
  }, [theme, mounted]);

  const setTheme = React.useCallback((next: Theme) => setThemeState(next), []);
  const toggle = React.useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return { theme, setTheme, toggle, mounted };
}

export default useTheme;
