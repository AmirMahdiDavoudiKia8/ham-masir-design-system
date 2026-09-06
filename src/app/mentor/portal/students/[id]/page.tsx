import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getSessionMentor, getStudent } from "@/lib/mentorPortal";
import { StudentPlanEditor } from "./StudentPlanEditor";

interface StudentPageProps {
  params: Promise<{ id: string }>;
}

export default async function MentorPortalStudentPage({ params }: StudentPageProps) {
  const { id } = await params;
  const mentor = await getSessionMentor();
  if (!mentor) redirect("/mentor/portal/login");
  if (!mentor.studentIds.includes(id)) notFound();

  const student = await getStudent(id);
  if (!student) notFound();

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Link
          href="/mentor/portal/students"
          aria-label="بازگشت"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors duration-standard ease-gentle hover:bg-muted active:scale-95"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-h1 font-bold text-foreground">{student.name}</h1>
          <p dir="ltr" className="text-caption text-muted-foreground">
            {student.phone}
          </p>
        </div>
      </div>

      <StudentPlanEditor student={student} />
    </div>
  );
}
