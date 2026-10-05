import { redirect } from "next/navigation";
import { isPlanKey } from "@/lib/plans";
import { firstParam } from "@/lib/searchParams";

interface BookingEntryPageProps {
  params: Promise<{ mentorId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * This used to be the time-picker screen. Students no longer pick a time —
 * it's agreed on a phone call (see lib/slots) — so the flow goes straight from
 * choosing a plan to reserving. The route itself stays as a redirect because
 * it's the URL in every mentor profile's structured data (Offer.serviceUrl)
 * and in any link already shared or bookmarked.
 */
export default async function BookingEntryPage({ params, searchParams }: BookingEntryPageProps) {
  const { mentorId } = await params;
  const sp = await searchParams;
  const planParam = firstParam(sp.plan);
  const next = new URLSearchParams({ plan: isPlanKey(planParam) ? planParam : "session" });
  const back = firstParam(sp.back);
  if (back) next.set("back", back);
  redirect(`/student/booking/${encodeURIComponent(mentorId)}/payment?${next.toString()}`);
}
