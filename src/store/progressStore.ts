"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  /** taskId -> done, only for tasks the student has actually toggled; anything absent falls back to the plan's own baked-in default. */
  doneOverrides: Record<string, boolean>;
  toggleTask: (taskId: string, currentlyDone: boolean) => void;
  /** Part of "خروج از حساب" (see ProfileActions) — the next student on this device shouldn't see the previous one's ticked tasks. */
  clearOverrides: () => void;
}

/**
 * Persists which checklist tasks the student has ticked, so progress
 * survives a reload — the plan/calendar structure itself still comes from
 * local static data (lib/progress.ts); only the student's interaction with
 * it lives here.
 *
 * TODO: seam for a real backend — sync toggleTask to the server instead of
 * (or in addition to) localStorage, without touching the Progress screen.
 */
export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      doneOverrides: {},
      toggleTask: (taskId, currentlyDone) =>
        set((state) => ({
          doneOverrides: { ...state.doneOverrides, [taskId]: !currentlyDone },
        })),
      clearOverrides: () => set({ doneOverrides: {} }),
    }),
    { name: "hammasir-progress" },
  ),
);
