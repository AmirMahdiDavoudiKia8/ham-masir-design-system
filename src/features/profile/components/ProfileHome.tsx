"use client";

import { PhoneAuthGate } from "@/features/auth/components/PhoneAuthGate";
import { MentorAvatar } from "@/features/mentors/components/MentorAvatar";
import { useBookingsStore } from "@/store/bookingsStore";
import { getProfileCompletion, useProfileStore } from "@/store/profileStore";
import { ProfileActions } from "./ProfileActions";
import { ProfileCompletionCard } from "./ProfileCompletionCard";

/**
 * Student's own profile: photo, completion card, then the four entry points
 * below it. The intake-quiz answers now live on the edit-profile screen
 * (editable there), not here.
 *
 * Gated behind identity verification (see features/auth/PhoneAuthGate): a
 * first-time visitor, or a returning one whose data isn't saved on this
 * device (profile.phone empty — e.g. after logging out, or a new device),
 * sees the phone+password gate instead of jumping straight into a
 * half-filled profile. Verifying sets profile.name/phone, which unlocks the
 * real profile screen below — and pulls in any bookings made on another
 * device for that phone (see lib/studentBookings), so switching devices
 * doesn't look like the booking vanished.
 */
export function ProfileHome() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const restoreBookings = useBookingsStore((s) => s.restoreBookings);
  const percent = getProfileCompletion(profile);

  function handleVerified(name: string, phone: string) {
    updateProfile({ name, phone });
    fetch(`/api/student-bookings?phone=${encodeURIComponent(phone)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) restoreBookings(data.bookings);
      })
      .catch(() => {});
  }

  if (!profile.phone) {
    return <PhoneAuthGate onVerified={handleVerified} />;
  }

  return (
    <div className="flex flex-col gap-5 px-4 pb-2 pt-6 animate-rise-in">
      <div className="flex flex-col items-center gap-2">
        <MentorAvatar photo={profile.avatar || undefined} name={profile.name} size={88} />
        {profile.name && <p className="text-h3 font-bold text-foreground">{profile.name}</p>}
      </div>

      <ProfileCompletionCard percent={percent} />

      <ProfileActions />
    </div>
  );
}
