import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "@/lib/fileLock";
import { normalizePersianText } from "@/lib/format";

const FILE = path.join(process.cwd(), "src/data/studentIdentities.json");

export interface StudentAccount {
  name: string;
  password: string;
}

type StudentAccounts = Record<string, StudentAccount>;

async function getAll(): Promise<StudentAccounts> {
  try {
    const raw = JSON.parse(await readFile(FILE, "utf-8"));
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

async function saveAll(data: StudentAccounts): Promise<void> {
  await writeFile(FILE, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

export async function isPhoneKnown(phone: string): Promise<boolean> {
  const all = await getAll();
  return phone in all;
}

export type RegisterResult = { status: "created"; name: string } | { status: "exists" };

/**
 * Real OTP isn't wired up (no eNamad-approved gateway yet), so phone+password
 * is the whole auth model for now — same shape as the mentor portal's own
 * accounts (see lib/mentorPortal.ts, including its no-real-security caveat:
 * passwords are stored in plain text since there's no real backend). Phone
 * is the id; a phone can only ever register once, so a student can't end up
 * with two different accounts under the same number.
 */
export async function registerStudent(phone: string, name: string, password: string): Promise<RegisterResult> {
  return withFileLock(FILE, async () => {
    const all = await getAll();
    if (all[phone]) return { status: "exists" };

    const account: StudentAccount = { name: name.trim(), password };
    all[phone] = account;
    await saveAll(all);
    return { status: "created", name: account.name };
  });
}

/** Login lookup — matches by phone (id) *and* password. Compared through normalizePersianText — see mentorPortal.ts's findMentorByCredentials for why a raw === would be wrong here. */
export async function findStudentByCredentials(phone: string, password: string): Promise<StudentAccount | null> {
  const all = await getAll();
  const account = all[phone];
  if (!account || normalizePersianText(account.password) !== normalizePersianText(password)) return null;
  return account;
}
