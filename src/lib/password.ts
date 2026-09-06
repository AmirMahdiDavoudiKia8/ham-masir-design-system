import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { normalizePersianText } from "@/lib/format";

/**
 * Password hashing for the mentor and student account stores.
 *
 * Both stores used to keep the password as plain text (see the caveats that
 * used to sit on lib/mentorPortal.ts and lib/studentIdentities.ts), which
 * meant anyone with the persistent/ tarball — or a copy of leads.json, which
 * the mentor signup used to log the password into — could read every
 * account's password directly. Hashing here needs no database and no new
 * dependency: scrypt ships with Node.
 *
 * Two things this deliberately preserves from the old comparison:
 *
 * 1. Both sides go through normalizePersianText *before* hashing, exactly as
 *    the old plain-text `===` did. A password typed on an Arabic-layout
 *    keyboard at registration has to keep matching the same password typed
 *    on a Persian-layout one at login — mentors have been locked out of the
 *    portal by that mismatch before, and switching to hashes must not
 *    reintroduce it.
 *
 * 2. `verifyPassword` still accepts a stored value that is plain text, so
 *    every existing account keeps working. Callers upgrade a matched legacy
 *    password to a hash on the spot (see findMentorByCredentials /
 *    findStudentByCredentials), so the files convert themselves as people
 *    log in — no migration script, no forced reset, nobody locked out.
 *    Hand-written accounts added straight to mentors.json also keep working.
 */

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const PREFIX = "scrypt$";
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

/** Whether a stored value is already hashed, as opposed to a legacy plain-text password. */
export function isHashed(stored: string): boolean {
  return typeof stored === "string" && stored.startsWith(PREFIX);
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derived = await scrypt(normalizePersianText(plain), salt, KEY_LENGTH);
  // base64 never contains "$", so splitting on it stays unambiguous.
  return `${PREFIX}${salt.toString("base64")}$${derived.toString("base64")}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (typeof stored !== "string" || stored.length === 0) return false;

  const candidate = normalizePersianText(plain);

  // Legacy account that hasn't been upgraded yet — same comparison as before.
  if (!isHashed(stored)) return normalizePersianText(stored) === candidate;

  const [, saltB64, hashB64] = stored.split("$");
  if (!saltB64 || !hashB64) return false;

  const expected = Buffer.from(hashB64, "base64");
  const derived = await scrypt(candidate, Buffer.from(saltB64, "base64"), expected.length);
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}
