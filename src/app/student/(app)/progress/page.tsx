import { Header } from "@/components/layout/Header";
import { ProgressHome } from "@/features/progress/components/ProgressHome";
import { getMentors } from "@/lib/mentors";
import { getProgressData } from "@/lib/progress";
import { getSessionStudent } from "@/lib/mentorPortal";

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
