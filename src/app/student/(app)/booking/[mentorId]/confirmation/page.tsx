import { notFound } from "next/navigation";
import { ConfirmationView } from "@/features/booking/components/ConfirmationView";
import { getMentors } from "@/lib/mentors";
import { isPlanKey } from "@/lib/plans";
import { firstParam } from "@/lib/searchParams";
import { PHONE_COORDINATED_SLOT } from "@/lib/slots";

interface ConfirmationPageProps {
  params: Promise<{ mentorId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ConfirmationPage({ params, searchParams }: ConfirmationPageProps) {
  const { mentorId } = await params;
  const sp = await searchParams;
  const planParam = firstParam(sp.plan);
  const plan = isPlanKey(planParam) ? planParam : "session";
  const slot = firstParam(sp.slot) || PHONE_COORDINATED_SLOT;

  const mentors = await getMentors();
  const mentor = mentors.find((m) => m.id === mentorId);
  if (!mentor) notFound();

  return <ConfirmationView mentor={mentor} plan={plan} slot={slot} />;
}
