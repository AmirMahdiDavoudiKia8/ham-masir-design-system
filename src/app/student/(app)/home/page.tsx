import { Header } from "@/components/layout/Header";
import { HomeContent } from "@/features/sessions/components/HomeContent";
import type { ResolvedBooking } from "@/features/sessions/resolveBooking";
import { getMentors } from "@/lib/mentors";
import { getSessionStudent } from "@/lib/mentorPortal";

export default async function HomePage() {
  const [mentors, sessionStudent] = await Promise.all([getMentors(), getSessionStudent()]);

  // A subscription made on another device (or restored after this browser's
  // storage was cleared) has no entry in the local bookingsStore — this is
  // the server-authoritative fallback so it still renders here. See
  // PortalStudent.mentorId's doc comment in lib/mentorPortal.ts.
  const serverMentor = sessionStudent?.mentorId ? mentors.find((m) => m.id === sessionStudent.mentorId) : undefined;
  const serverSession: ResolvedBooking | undefined = serverMentor
    ? {
        id: "server-session",
        mentorId: serverMentor.id,
        mentorName: serverMentor.name,
        mentorField: [serverMentor.field, serverMentor.university].filter(Boolean).join("، "),
        mentorPhoto: serverMentor.photo,
        plan: "subscription",
        planTitle: "طرح بادیگارد",
        status: "upcoming",
      }
    : undefined;

  return (
    <>
      <Header />
      <HomeContent
        mentors={mentors}
        meetLink={sessionStudent?.meetLink}
        cancelled={sessionStudent?.cancelled}
        serverSession={serverSession}
      />
    </>
  );
}
