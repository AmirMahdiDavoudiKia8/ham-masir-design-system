import { redirect } from "next/navigation";
import { MentorProfileForm } from "@/features/mentorPortal/components/MentorProfileForm";
import { getSessionMentor } from "@/lib/mentorPortal";
import { getCatalogueMentorById } from "@/lib/mentors";

export default async function MentorPortalProfilePage() {
  const mentor = await getSessionMentor();
  if (!mentor) redirect("/mentor/portal/login");

  // Catalogue mentors' real public profile lives in the curated catalogue
  // (see MentorAccount.catalogueId's doc comment) — their portal account
  // itself has none of these fields filled in, so without this the form
  // would show up blank for someone editing an already-live profile.
  const catalogue = mentor.catalogueId ? await getCatalogueMentorById(mentor.catalogueId) : undefined;

  return (
    <MentorProfileForm
      mentorName={catalogue?.name ?? mentor.name}
      isEditingLiveProfile={Boolean(mentor.catalogueId)}
      approved={mentor.approved === true}
      initialPhoto={catalogue?.photo ?? mentor.photo}
      initialField={catalogue?.field ?? mentor.field}
      initialUniversity={catalogue?.university ?? mentor.university}
      initialRank={catalogue?.rank ?? mentor.rank}
      initialTrack={catalogue?.track ?? mentor.track}
      initialGender={catalogue?.gender ?? mentor.gender}
      initialBio={catalogue?.bio ?? mentor.bio}
      initialJourney={catalogue?.journey ?? mentor.journey}
      initialLessons={catalogue?.lessons ?? mentor.lessons}
      initialHelpsWith={catalogue?.helpsWith ?? mentor.helpsWith}
      initialAvailabilityWindows={catalogue?.availabilityWindows ?? mentor.availabilityWindows}
      initialVoiceIntro={catalogue?.voiceIntro ?? mentor.voiceIntro}
    />
  );
}
