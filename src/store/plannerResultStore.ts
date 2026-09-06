"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PlannerFormData } from "@/features/planner/types";

interface PlannerResultState {
  formData: PlannerFormData | null;
  setFormData: (formData: PlannerFormData) => void;
}

/**
 * Holds a completed برنامه‌ساز کنکور session's answers for the current tab
 * only (sessionStorage, not localStorage — see matchQuizStore.ts for the
 * localStorage equivalent, which is deliberately different because that one
 * needs to survive across visits). PlannerFlow reads this on mount to skip
 * straight to the result instead of restarting the 6-step form: without it,
 * clicking the result page's "هم‌مسیرم رو پیدا کن" (which navigates away to
 * /student/discover) and then hitting the browser's back button lands back
 * on Step 1 with everything lost, since that navigation fully unmounts
 * PlannerFlow and its local useState. A fresh visit on a later day (new tab
 * session) still starts clean.
 */
export const usePlannerResultStore = create<PlannerResultState>()(
  persist(
    (set) => ({
      formData: null,
      setFormData: (formData) => set({ formData }),
    }),
    {
      name: "hammasir-planner-result",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
