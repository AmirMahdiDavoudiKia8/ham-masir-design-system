import type { Metadata } from "next";
import { OnboardingFlow } from "@/features/onboarding/components/OnboardingFlow";

/** Sign-up flow, not content — noindex so it can't compete with /student/home for brand queries. */
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
