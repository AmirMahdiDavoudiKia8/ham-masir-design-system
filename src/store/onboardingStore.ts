"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OnboardingAnswers {
  stage: string;
  goal: string;
  need: string;
  contact: string;
}

const EMPTY_ANSWERS: OnboardingAnswers = { stage: "", goal: "", need: "", contact: "" };

interface OnboardingState {
  answers: OnboardingAnswers;
  setAnswers: (answers: OnboardingAnswers) => void;
  /** Part of "خروج از حساب" (see ProfileActions) — the next student on this device shouldn't see the previous one's intake-quiz answers. */
  clearAnswers: () => void;
}

/**
 * The intake quiz's answers (human-readable labels, not the raw option
 * keys) — written once when OnboardingFlow completes, then editable from
 * /student/profile/edit. They're what seeds the profile-completion gauge's
 * starting 50%, so revising them here doesn't change that baseline.
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      answers: EMPTY_ANSWERS,
      setAnswers: (answers) => set({ answers }),
      clearAnswers: () => set({ answers: EMPTY_ANSWERS }),
    }),
    { name: "hammasir-onboarding" },
  ),
);
