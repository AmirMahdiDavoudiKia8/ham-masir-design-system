import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "@/lib/fileLock";

export interface StoredStudentProfile {
  fieldOfStudy: string;
  city: string;
  stage: string;
  goal: string;
  need: string;
  contact: string;
}

const FILE = path.join(process.cwd(), "src/data/studentProfiles.json");

async function getAll(): Promise<Record<string, StoredStudentProfile>> {
  try {
    const raw = JSON.parse(await readFile(FILE, "utf-8"));
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

async function saveAll(data: Record<string, StoredStudentProfile>): Promise<void> {
  await writeFile(FILE, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

export async function getStudentProfile(phone: string): Promise<StoredStudentProfile | null> {
  const all = await getAll();
  return all[phone] ?? null;
}

/**
 * Durable, phone-keyed copy of the profile-edit fields and onboarding-quiz
 * answers — what makes them survive "خروج از حساب" (which deliberately
 * clears the client-only profileStore/onboardingStore, see those stores'
 * `logout`/`clearAnswers` doc comments) instead of looking like data loss
 * to the same student logging back in. Same shape as studentBookings.ts.
 */
export async function saveStudentProfile(phone: string, patch: Partial<StoredStudentProfile>): Promise<void> {
  return withFileLock(FILE, async () => {
    const all = await getAll();
    const existing = all[phone] ?? { fieldOfStudy: "", city: "", stage: "", goal: "", need: "", contact: "" };
    all[phone] = { ...existing, ...patch };
    await saveAll(all);
  });
}
