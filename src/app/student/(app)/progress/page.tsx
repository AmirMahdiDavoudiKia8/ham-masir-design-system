import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ProgressHome } from "@/features/progress/components/ProgressHome";
import { getMentors } from "@/lib/mentors";
import { getProgressData } from "@/lib/progress";
import { getSessionStudent } from "@/lib/mentorPortal";

/**
 * A signed-in student's own weekly plan — never a search result. It was
 * reachable at 200 with the layout's default index,follow and is not covered
 * by robots.txt, so it was genuinely indexable. Left crawlable on purpose so
 * Google can actually see this noindex and drop it (a robots.txt Disallow
 * would hide the directive it needs to read).
 */
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default async function ProgressPage() {
  const [{ studyPlan, monthCalendar }, mentors, sessionStudent] = await Promise.all([
    getProgressData(),
    getMentors(),
    getSessionStudent(),
  ]);

  // A student who's booked a subscription has a real, server-side weekly
  // plan (written by their mentor in the mentor portal) — that replaces the
  // shared demo plan. The month calendar stays the shared cosmetic backdrop
  // either way; only this week's real tasks need to be real.
  const effectiveStudyPlan = sessionStudent
    ? { weekLabel: sessionStudent.weekLabel, days: sessionStudent.days }
    : studyPlan;

  // Same server-authoritative fallback as /student/home — a subscription
  // made on another device has no entry in the local bookingsStore, so the
  // mentor attribution line needs a source that doesn't depend on it. See
  // PortalStudent.mentorId's doc comment in lib/mentorPortal.ts.
  const serverMentorName = sessionStudent?.mentorId
    ? mentors.find((m) => m.id === sessionStudent.mentorId)?.name
    : undefined;

  return (
    <>
      <Header />
      <div className="flex flex-col px-4 pb-2 pt-6">
        <ProgressHome
          studyPlan={effectiveStudyPlan}
          monthCalendar={monthCalendar}
          mentors={mentors}
          studentId={sessionStudent?.id}
          cancelled={sessionStudent?.cancelled}
          serverMentorName={serverMentorName}
        />
      </div>
    </>
  );
}
