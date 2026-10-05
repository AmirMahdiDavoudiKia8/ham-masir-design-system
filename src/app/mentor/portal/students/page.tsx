import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeftIcon, EditIcon, LogOutIcon } from "@/design-system";
import { getSessionMentor, getStudent, isMentorProfileComplete } from "@/lib/mentorPortal";
import { logoutMentor } from "../login/actions";

export default async function MentorPortalStudentsPage() {
  const mentor = await getSessionMentor();
  if (!mentor) redirect("/mentor/portal/login");
  if (!mentor.catalogueId && !isMentorProfileComplete(mentor)) redirect("/mentor/portal/profile");

  const students = (await Promise.all(mentor.studentIds.map((id) => getStudent(id)))).filter(
    (s): s is NonNullable<typeof s> => s !== null,
  );

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-h1 font-bold text-foreground">سلام {mentor.name}</h1>
          <p className="mt-1 text-caption text-muted-foreground">دانش‌آموزهات رو انتخاب کن</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href="/mentor/portal/profile"
            aria-label="ویرایش پروفایل"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors duration-standard ease-gentle hover:bg-primary-soft hover:text-primary"
          >
            <EditIcon className="h-5 w-5" />
          </Link>
          <form action={logoutMentor}>
            <button
              type="submit"
              aria-label="خروج"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-standard ease-gentle hover:bg-alert-soft hover:text-danger"
            >
              <LogOutIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* A self-registered mentor lands here the moment their profile is
          complete, and would otherwise have no way to tell whether they're
          actually on the site yet — approval is a manual step (see
          MentorAccount.approved), so say where they stand rather than
          leaving them to search the catalogue for themselves. */}
      {!mentor.catalogueId && mentor.approved !== true && (
        <p className="rounded-md border border-dashed border-border px-3.5 py-2.5 text-caption text-muted-foreground">
          پروفایلت کامله و در انتظار تاییده. به‌محض تایید، روی سایت منتشر می‌شه و دانش‌آموزها می‌تونن پیدات کنن و وقت رزرو کنن.
        </p>
      )}

      {students.length === 0 ? (
        <p className="text-center text-caption text-muted-foreground">هنوز دانش‌آموزی برات ثبت نشده.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/mentor/portal/students/${student.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-card transition-all duration-standard ease-gentle active:scale-[0.98] hover:border-primary-light"
            >
              <span className="flex flex-col">
                <span className="flex items-center gap-2">
                  <span className="text-body font-bold text-foreground">{student.name}</span>
                  {student.cancelled && (
                    <span className="rounded-full bg-alert-soft px-2 py-0.5 text-label font-semibold text-danger">
                      لغو شده
                    </span>
                  )}
                </span>
                <span dir="ltr" className="text-label text-muted-foreground">
                  {student.phone}
                </span>
              </span>
              <ArrowLeftIcon className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
