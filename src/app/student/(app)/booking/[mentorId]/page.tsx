import { notFound } from "next/navigation";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { BookingTimeForm } from "@/features/booking/components/BookingTimeForm";
import { getMentors } from "@/lib/mentors";
import { isPlanKey } from "@/lib/plans";
import { firstParam } from "@/lib/searchParams";

interface BookingTimePageProps {
  params: Promise<{ mentorId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BookingTimePage({ params, searchParams }: BookingTimePageProps) {
  const { mentorId } = await params;
  const sp = await searchParams;
  const planParam = firstParam(sp.plan);
  const plan = isPlanKey(planParam) ? planParam : "session";

  const mentors = await getMentors();
  const mentor = mentors.find((m) => m.id === mentorId);
  if (!mentor) notFound();

  // Carries the mentors-list filter context (forwarded from the mentor
  // profile page) so this screen's back button returns to the exact results
  // the student searched.
  const back = firstParam(sp.back);

  return (
    <>
      <CompactHeader
        title="انتخاب زمان"
        backHref={back ? `/student/discover?${back}` : "/student/discover"}
      />
      <div className="flex flex-col px-4 pb-2 pt-5">
        <BookingTimeForm mentor={mentor} plan={plan} />
      </div>
    </>
  );
}
