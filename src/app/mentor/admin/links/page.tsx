import { redirect } from "next/navigation";
import { CopyLinkButton } from "@/features/adminMentors/CopyLinkButton";
import { isAdminSession } from "@/lib/adminAuth";
import { toPersianDigits } from "@/lib/format";
import { getMentors } from "@/lib/mentors";
import { SITE_URL } from "@/lib/siteConfig";

// Reads live off-disk data on every request — same as every other /mentor/admin/* page.
export const dynamic = "force-dynamic";

/**
 * One direct link per public mentor, ready to share. Each points straight at
 * the canonical profile page (/student/mentors/<id>) rather than a separate
 * short-link route, so a shared link and the URL Google indexes are the same
 * page and nothing extra has to be kept in sync.
 *
 * Lists exactly what getMentors() returns — i.e. only mentors students can
 * actually see — so every link here opens a real profile.
 */
export default async function AdminMentorLinksPage() {
  if (!(await isAdminSession())) redirect("/mentor/admin/login?next=/mentor/admin/links");

  const mentors = await getMentors();

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-h1 font-bold text-foreground">لینک پروفایل منتورها</h1>
        <p className="mt-1 text-caption text-muted-foreground">
          هر لینک مستقیم صفحه‌ی پروفایل همون منتور رو باز می‌کنه ({toPersianDigits(mentors.length)} منتور).
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {mentors.map((mentor) => {
          const url = `${SITE_URL}/student/mentors/${encodeURIComponent(mentor.id)}`;
          return (
            <li key={mentor.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
              {mentor.photo && (
                // eslint-disable-next-line @next/next/no-img-element -- mixes build-time and runtime upload paths
                <img src={mentor.photo} alt="" className="size-11 shrink-0 rounded-full object-cover" />
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-body font-bold text-foreground">{mentor.name || "بدون اسم"}</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  dir="ltr"
                  className="truncate text-left text-caption text-primary underline-offset-2 hover:underline"
                >
                  {url}
                </a>
              </div>
              <CopyLinkButton url={url} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
