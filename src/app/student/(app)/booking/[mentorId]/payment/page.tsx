import { notFound, redirect } from "next/navigation";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { PaymentForm } from "@/features/booking/components/PaymentForm";
import { getMentors } from "@/lib/mentors";
import { isPlanKey } from "@/lib/plans";
import { firstParam } from "@/lib/searchParams";

interface PaymentPageProps {
  params: Promise<{ mentorId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentPage({ params, searchParams }: PaymentPageProps) {
  const { mentorId } = await params;
  const sp = await searchParams;
  const planParam = firstParam(sp.plan);
  const plan = isPlanKey(planParam) ? planParam : "session";
  const slot = firstParam(sp.slot);

  const mentors = await getMentors();
  const mentor = mentors.find((m) => m.id === mentorId);
  if (!mentor) notFound();
  // No time proposed yet (e.g. a direct/refreshed link) — send back to pick one.
  if (!slot) redirect(`/student/booking/${mentorId}?plan=${plan}`);

  return (
    <>
      <CompactHeader
        title="پرداخت"
        backHref={`/student/booking/${mentorId}?plan=${plan}&slot=${encodeURIComponent(slot)}`}
      />
      <div className="flex flex-col px-4 pb-2 pt-5">
        <PaymentForm mentor={mentor} plan={plan} slot={slot} />
      </div>
    </>
  );
}
