import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/adminAuth";
import { getProgressData } from "@/lib/progress";
import { PlanEditorForm } from "./PlanEditorForm";

// Without this, Next.js's build-time prerender pass ran isAdminSession()
// with no real cookie, saw it redirect, and baked that redirect into a
// STATIC page — served for every future request regardless of the actual
// runtime cookie, which produced an infinite redirect loop with the login
// page's own (correctly dynamic) forward-once-authenticated check. The
// other two /mentor/admin/* pages already had this; this one didn't,
// because its cookie read happens through the isAdminSession() helper
// rather than a direct top-level `await cookies()` call, and Next's
// auto-dynamic detection didn't pick that up the same way.
export const dynamic = "force-dynamic";

/**
 * Internal-only MVP tool — not linked from anywhere in the app's nav, gated
 * by isAdminSession (see lib/adminAuth.ts). Lets whoever's operating the
 * account write the week's study plan (saved straight into progress.json)
 * and, on the same screen, see and adjust the student's real tick-state for
 * it. See actions.ts for why this is a single shared demo student rather
 * than a real per-mentor backend.
 */
export default async function MentorPlanAdminPage() {
  if (!(await isAdminSession())) redirect("/mentor/admin/login?next=/mentor/admin/plan");

  const { studyPlan } = await getProgressData();

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-h1 font-bold text-foreground">مدیریت برنامه‌ی هفتگی</h1>
        <p className="mt-1 text-caption text-muted-foreground">
          این صفحه فقط داخلیه. برنامه‌ای که اینجا ذخیره کنی، همون لحظه توی «پیشرفت» دانش‌آموز دیده می‌شه.
        </p>
      </div>

      <PlanEditorForm initialWeekLabel={studyPlan.weekLabel ?? ""} initialDays={studyPlan.days} />
    </div>
  );
}
