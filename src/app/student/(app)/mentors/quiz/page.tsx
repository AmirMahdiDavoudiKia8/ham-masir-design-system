import type { Metadata } from "next";
import { MatchQuizFlow } from "@/features/discovery/components/MatchQuizFlow";

/** An interactive matching quiz whose whole content is client-side state — nothing here for a search result to be about, and /student/discover is the page that should rank instead. */
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function MentorMatchQuizPage() {
  return <MatchQuizFlow />;
}
