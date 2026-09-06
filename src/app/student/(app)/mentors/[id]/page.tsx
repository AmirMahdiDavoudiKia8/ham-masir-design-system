import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { AccompaniedLineIcon } from "@/components/ui/icons";
import { MentorAvailability } from "@/features/mentors/components/MentorAvailability";
import { MentorIdentity } from "@/features/mentors/components/MentorIdentity";
import { MentorNarrative } from "@/features/mentors/components/MentorNarrative";
import { MentorPlans } from "@/features/mentors/components/MentorPlans";
import { MentorProfileHeader } from "@/features/mentors/components/MentorProfileHeader";
import { getMentors } from "@/lib/mentors";
import { firstParam } from "@/lib/searchParams";
import { getUniversityLogo } from "@/lib/universityLogos";

interface MentorProfilePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * The mentor's full story — the destination MentorCard now navigates to
 * directly, replacing the old booking bottom sheet. Resolves the mentor by
 * id from the one canonical source (lib/mentors.ts); never declares its own
 * mentor data. Every section is independently optional and hides itself
 * rather than rendering empty (canon: degrade gracefully, never broken UI).
 */
export default async function MentorProfilePage({ params, searchParams }: MentorProfilePageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const back = firstParam(sp.back);
  const resultsHref = `/student/discover${back ? `?${back}` : ""}`;

  const mentors = await getMentors();
  const mentor = mentors.find((m) => m.id === id);

  if (!mentor) {
    return (
      <>
        <div className="relative h-14">
          <MentorProfileHeader backHref={resultsHref} />
        </div>
        <div className="flex flex-col items-center gap-4 px-6 pb-2 pt-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <AccompaniedLineIcon className="h-7 w-7" />
          </span>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-h2 font-bold text-foreground">این هم‌مسیر رو پیدا نکردیم</h1>
            <p className="max-w-[24rem] text-caption text-muted-foreground">
              شاید پروفایلش جابه‌جا شده باشه. برگرد به نتایج و یکی دیگه رو پیدا کن.
            </p>
          </div>
          <Link href={resultsHref} className={buttonClasses("primary", "md", false, "mt-1")}>
            بازگشت به نتایج
          </Link>
        </div>
      </>
    );
  }

  const universityLogo = getUniversityLogo(mentor.university);

  return (
    <>
      <div className="relative">
        <div className="relative h-28 overflow-hidden rounded-b-[28px] bg-gradient-to-br from-primary-hover to-primary">
          {universityLogo && (
            <Image
              src={universityLogo}
              alt=""
              aria-hidden
              fill
              priority
              className="scale-125 object-contain opacity-35 mix-blend-multiply"
            />
          )}
        </div>
        <MentorProfileHeader backHref={resultsHref} />
        <div className="-mt-12 px-5">
          <MentorIdentity mentor={mentor} />
        </div>
      </div>

      <div className="flex flex-col gap-9 px-5 pb-10 pt-9">
        <div className="border-t border-border pt-9">
          <MentorNarrative mentor={mentor} />
        </div>

        <div className="border-t border-border pt-9">
          <MentorAvailability mentor={mentor} />
        </div>

        <div className="border-t border-border pt-9">
          <MentorPlans mentor={mentor} back={back} />
        </div>
      </div>
    </>
  );
}
