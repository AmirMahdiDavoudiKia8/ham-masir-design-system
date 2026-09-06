"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StudentProfile {
  name: string;
  phone: string;
  /** Data URL from the file picker on the edit screen — no upload endpoint exists yet. */
  avatar: string;
  fieldOfStudy: string;
  city: string;
}

const EMPTY_PROFILE: StudentProfile = {
  name: "",
  phone: "",
  avatar: "",
  fieldOfStudy: "",
  city: "",
};

/**
 * Fields that count toward the completion percentage on the profile card —
 * every one of them is editable from /student/profile/edit. Excludes
 * "avatar" — there's no upload UI for it anymore — and "grade"/"goal"-type
 * answers: those were already collected during onboarding (see
 * onboardingStore) and are shown there read-only instead of being re-asked
 * here.
 */
const COMPLETION_FIELDS: (keyof StudentProfile)[] = ["name", "phone", "fieldOfStudy", "city"];

/**
 * Onboarding (stage/goal/need/contact) already covers half the profile
 * before the student ever reaches this screen, so the gauge starts at 50%
 * instead of 0% — the remaining half fills in as these fields get edited.
 */
export function getProfileCompletion(profile: StudentProfile): number {
  const filled = COMPLETION_FIELDS.filter((key) => profile[key].trim().length > 0).length;
  const editedShare = filled / COMPLETION_FIELDS.length;
  return Math.round(50 + editedShare * 50);
}

interface ProfileState {
  profile: StudentProfile;
  updateProfile: (patch: Partial<StudentProfile>) => void;
  /** Clears this device's identity (name/phone/avatar/etc.) — what "خروج از حساب" actually does, since there's no server session to invalidate. Puts the profile tab back behind the phone gate (see ProfileHome). */
  logout: () => void;
}

/**
 * The single source of truth for the student's own profile data. Persisted
 * to localStorage — same pattern as bookingsStore/progressStore.
 *
 * TODO: this is the seam where a real backend replaces local persistence —
 * swap the `persist` storage for a server sync (GET on load, PATCH on
 * updateProfile) without touching any screen that reads `useProfileStore`.
 */
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: EMPTY_PROFILE,
      updateProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
      logout: () => set({ profile: EMPTY_PROFILE }),
    }),
    { name: "hammasir-profile" },
  ),
);
