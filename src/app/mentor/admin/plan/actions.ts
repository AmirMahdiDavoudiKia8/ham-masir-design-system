"use server";

import { revalidatePath } from "next/cache";
import { isAdminSession } from "@/lib/adminAuth";
import { withFileLock } from "@/lib/fileLock";
import { readJson, writeJson } from "@/lib/storage";
import type { PlanDay } from "@/lib/progress";

const PROGRESS_FILE = "src/data/progress/progress.json";

/**
 * Internal MVP write path: overwrites the single shared studyPlan.days in
 * progress.json — there's no per-student data model yet (see lib/progress.ts),
 * so this is deliberately a single demo student, not a real multi-tenant
 * backend. Revalidates both this admin page and the student progress page so
 * the save shows up immediately on both.
 *
 * Re-checks isAdminSession() here, not just on the page — a server action's
 * endpoint is directly callable once its id ships in the client bundle,
 * bypassing whatever the page component itself gates on.
 */
export async function saveStudyPlan(weekLabel: string, days: PlanDay[]): Promise<void> {
  if (!(await isAdminSession())) throw new Error("دسترسی نداری.");

  await withFileLock(PROGRESS_FILE, async () => {
    const raw = (await readJson<Record<string, unknown>>(PROGRESS_FILE, { studyPlan: {} })) as Record<string, unknown>;
    raw.studyPlan = { weekLabel: weekLabel.trim() || undefined, days };
    await writeJson(PROGRESS_FILE, raw);
  });
  revalidatePath("/mentor/admin/plan");
  revalidatePath("/student/progress");
}
