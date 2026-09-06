"use server";

import { revalidatePath } from "next/cache";
import { isAdminSession } from "@/lib/adminAuth";
import { setMentorApproval } from "@/lib/mentorPortal";

/**
 * The founder's approve / un-approve switch for a self-registered mentor —
 * the single thing standing between an open registration link and a
 * stranger's card being live on the public site (see
 * MentorAccount.approved).
 *
 * Guarded by isAdminSession here, not just on the page that renders the
 * buttons: a server action is a POST endpoint anyone can call directly once
 * they know its id, so a page-level `redirect` on the way in protects the
 * UI, not the write.
 */
export async function setApproval(mentorId: string, approved: boolean): Promise<{ error?: string }> {
  if (!(await isAdminSession())) return { error: "دسترسی نداری." };

  await setMentorApproval(mentorId, approved);
  // Every student-facing screen reads the catalogue (discover, the mentor
  // list, booking, the public profile page), and they're otherwise cached —
  // approving should show up right away, and revoking should take the card
  // down right away, which matters a lot more.
  revalidatePath("/student", "layout");
  revalidatePath("/mentor/admin/mentors");
  return {};
}
