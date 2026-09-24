import { withFileLock } from "@/lib/fileLock";
import { readJson, writeJson } from "@/lib/storage";
import { hashPassword, isHashed, verifyPassword } from "@/lib/password";

const FILE = "src/data/studentIdentities.json";

export interface StudentAccount {
  name: string;
  password: string;
}

type StudentAccounts = Record<string, StudentAccount>;

async function getAll(): Promise<StudentAccounts> {
  return readJson<StudentAccounts>(FILE, {});
}

async function saveAll(data: StudentAccounts): Promise<void> {
  await writeJson(FILE, data);
}

export async function isPhoneKnown(phone: string): Promise<boolean> {
  const all = await getAll();
  return phone in all;
}

export type RegisterResult = { status: "created"; name: string } | { status: "exists" };

/**
 * Real OTP isn't wired up (no eNamad-approved gateway yet), so phone+password
 * is the whole auth model for now — same shape as the mentor portal's own
 * accounts (see lib/mentorPortal.ts). The password is hashed on the way in
 * and any account still holding a legacy plain-text one is upgraded at its
 * owner's next login (see lib/password.ts). Phone is the id; a phone can
 * only ever register once, so a student can't end up with two different
 * accounts under the same number.
 */
export async function registerStudent(phone: string, name: string, password: string): Promise<RegisterResult> {
  return withFileLock(FILE, async () => {
    const all = await getAll();
    if (all[phone]) return { status: "exists" };

    const account: StudentAccount = { name: name.trim(), password: await hashPassword(password) };
    all[phone] = account;
    await saveAll(all);
    return { status: "created", name: account.name };
  });
}

/**
 * Login lookup — matches by phone (id) *and* password. The comparison runs
 * through lib/password.ts, which normalizes Persian/Arabic character and
 * digit variants on both sides before hashing — see findMentorByCredentials
 * for the real incident that makes that normalization non-optional.
 *
 * A matched legacy plain-text password is rehashed here, the one moment the
 * real password is available. Best-effort: a failed write leaves the account
 * legacy rather than failing an otherwise valid login.
 */
export async function findStudentByCredentials(phone: string, password: string): Promise<StudentAccount | null> {
  const all = await getAll();
  const account = all[phone];
  if (!account || !(await verifyPassword(password, account.password))) return null;

  if (!isHashed(account.password)) {
    try {
      const hashed = await hashPassword(password);
      await withFileLock(FILE, async () => {
        const fresh = await getAll();
        if (fresh[phone]) {
          fresh[phone] = { ...fresh[phone], password: hashed };
          await saveAll(fresh);
        }
      });
      account.password = hashed;
    } catch {
      // keep the login working
    }
  }

  return account;
}
