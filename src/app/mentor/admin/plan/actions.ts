"use server";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { isAdminSession } from "@/lib/adminAuth";
import { withFileLock } from "@/lib/fileLock";
import type { PlanDay } from "@/lib/progress";

const PROGRESS_FILE = path.join(process.cwd(), "src/data/progress/progress.json");

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
    const raw = JSON.parse(await readFile(PROGRESS_FILE, "utf-8"));
    raw.studyPlan = { weekLabel: weekLabel.trim() || undefined, days };
    await writeFile(PROGRESS_FILE, `${JSON.stringify(raw, null, 2)}\n`, "utf-8");
  });
  revalidatePath("/mentor/admin/plan");
  revalidatePath("/student/progress");
}
