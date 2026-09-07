import { CompactHeader } from "@/components/layout/CompactHeader";
import { PaymentHistory } from "@/features/profile/components/PaymentHistory";
import { getMentors } from "@/lib/mentors";

export default async function ProfilePaymentsPage() {
  const mentors = await getMentors();

  return (
    <>
      <CompactHeader title="جلسه‌ها و تسویه" backHref="/student/profile" />
      <PaymentHistory mentors={mentors} />
    </>
  );
}
