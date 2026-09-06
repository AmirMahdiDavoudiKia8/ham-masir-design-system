import { getMentorAccounts, getStudent } from "@/lib/mentorPortal";

export interface MentorReliabilityRow {
  mentorId: string;
  mentorName: string;
  totalStudents: number;
  active: number;
  cancelledByMentor: number;
  cancelledByStudent: number;
  /** cancelledByMentor / totalStudents — the founder's real signal for "is this mentor a risk", since a student cancelling isn't the mentor's fault. 0 when this mentor has never had a student. */
  cancelRate: number;
}

/** Internal-only reliability signal (see /mentor/admin/reliability) — computed fresh from every mentor's roster and each student's `cancelled` field, not tracked separately. Sorted worst-first so a problem mentor surfaces immediately. */
export async function getMentorReliability(): Promise<MentorReliabilityRow[]> {
  const mentors = await getMentorAccounts();

  const rows = await Promise.all(
    mentors.map(async (mentor): Promise<MentorReliabilityRow> => {
      const students = await Promise.all(mentor.studentIds.map((id) => getStudent(id)));
      const real = students.filter((s): s is NonNullable<typeof s> => s !== null);
      const cancelledByMentor = real.filter((s) => s.cancelled?.by === "mentor").length;
      const cancelledByStudent = real.filter((s) => s.cancelled?.by === "student").length;
      const totalStudents = real.length;

      return {
        mentorId: mentor.id,
        mentorName: mentor.name,
        totalStudents,
        active: totalStudents - cancelledByMentor - cancelledByStudent,
        cancelledByMentor,
        cancelledByStudent,
        cancelRate: totalStudents === 0 ? 0 : cancelledByMentor / totalStudents,
      };
    }),
  );

  return rows.sort((a, b) => b.cancelRate - a.cancelRate || b.totalStudents - a.totalStudents);
}
