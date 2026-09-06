import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/adminAuth";
import { getMentorReliability } from "@/lib/mentorReliability";
import { toPersianDigits } from "@/lib/format";

// Same reasoning as /mentor/admin/analytics — reads live off-disk data, so
// this must never be statically prerendered.
export const dynamic = "force-dynamic";

function pct(rate: number): string {
  return `${toPersianDigits(Math.round(rate * 1000) / 10)}٪`;
}

/** Internal-only MVP tool, same pattern as /mentor/admin/analytics — not linked from anywhere, gated by isAdminSession (see lib/adminAuth.ts). Surfaces which mentors are cancelling their own students, since that's the one reliability signal the app can actually measure today (no attendance/lateness data exists yet). */
export default async function MentorReliabilityPage() {
  if (!(await isAdminSession())) redirect("/mentor/admin/login?next=/mentor/admin/reliability");

  const rows = await getMentorReliability();
  const withStudents = rows.filter((r) => r.totalStudents > 0);

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-h1 font-bold text-foreground">قابلیت اطمینان منتورها</h1>
        <p className="mt-1 text-caption text-muted-foreground">
          این صفحه فقط داخلیه، جایی لینک نشده. نرخ لغو از طرف خودِ منتور — لغو از طرف دانش‌آموز تقصیر منتور نیست، جدا شمرده شده.
        </p>
      </div>

      {withStudents.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface p-4 text-caption text-muted-foreground">
          هنوز هیچ منتوری دانش‌آموز نداشته — به‌محض اولین رزرو اشتراک، اینجا پر می‌شه.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {withStudents.map((row) => (
            <div key={row.mentorId} className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-body font-bold text-foreground">{row.mentorName}</span>
                {row.cancelledByMentor > 0 && (
                  <span className="shrink-0 rounded-full bg-alert-soft px-2.5 py-1 text-label font-bold text-danger">
                    {pct(row.cancelRate)} لغو
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
                <span>کل دانش‌آموز: {toPersianDigits(row.totalStudents)}</span>
                <span>فعال: {toPersianDigits(row.active)}</span>
                <span className={row.cancelledByMentor > 0 ? "font-bold text-danger" : undefined}>
                  لغو‌شده توسط خودش: {toPersianDigits(row.cancelledByMentor)}
                </span>
                <span>لغو‌شده توسط دانش‌آموز: {toPersianDigits(row.cancelledByStudent)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
