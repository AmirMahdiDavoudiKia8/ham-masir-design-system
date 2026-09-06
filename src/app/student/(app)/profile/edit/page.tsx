import { CompactHeader } from "@/components/layout/CompactHeader";
import { ProfileEditForm } from "@/features/profile/components/ProfileEditForm";

export default function ProfileEditPage() {
  return (
    <>
      <CompactHeader title="ویرایش پروفایل" backHref="/student/profile" />
      <ProfileEditForm />
    </>
  );
}
