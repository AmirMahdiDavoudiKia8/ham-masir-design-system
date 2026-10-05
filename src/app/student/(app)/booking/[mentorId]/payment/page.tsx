import { notFound } from "next/navigation";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { PaymentForm } from "@/features/booking/components/PaymentForm";
import { getMentors } from "@/lib/mentors";
import { isPlanKey } from "@/lib/plans";
import { firstParam } from "@/lib/searchParams";
import { PHONE_COORDINATED_SLOT } from "@/lib/slots";

interface PaymentPageProps {
  params: Promise<{ mentorId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * The reserve screen — now the first step after choosing a plan (there's no
 * time picker any more; see lib/slots). A `slot` in the URL is still honoured
 * so an old in-flight link keeps its picked window.
 */
export default async function PaymentPage({ params, searchParams }: PaymentPageProps) {
  const { mentorId } = await params;
  const sp = await searchParams;
  const planParam = firstParam(sp.plan);
  const plan = isPlanKey(planParam) ? planParam : "session";
  const slot = firstParam(sp.slot) || PHONE_COORDINATED_SLOT;
  const back = firstParam(sp.back);

  const mentors = await getMentors();
  const mentor = mentors.find((m) => m.id === mentorId);
  if (!mentor) notFound();

  // Back goes to the profile the plan was chosen on — the time picker that
  // used to sit in between no longer exists.
  const profileHref = `/student/mentors/${encodeURIComponent(mentor.id)}${back ? `?back=${encodeURIComponent(back)}` : ""}`;

  return (
    <>
      <CompactHeader title="ثبت رزرو" backHref={profileHref} />
      <div className="flex flex-col px-4 pb-2 pt-5">
        <PaymentForm mentor={mentor} plan={plan} slot={slot} />
      </div>
    </>
  );
}
