import { cookies } from "next/headers";
import { withFileLock } from "@/lib/fileLock";
import { readJson, writeJson } from "@/lib/storage";
import { digitsOnly, normalizePersianText } from "@/lib/format";
import { hashPassword, isHashed, verifyPassword } from "@/lib/password";
import type { PlanDay } from "@/lib/progress";

export const MENTOR_SESSION_COOKIE = "hammasir_mentor_id";
export const STUDENT_SESSION_COOKIE = "hammasir_student_id";

const WEEKDAY_LABELS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

export interface MentorAccount {
  id: string;
  password: string;
  name: string;
  studentIds: string[];
  /**
   * Set only when the founder provisions this portal account for a mentor
   * who already has a curated public profile in src/data/mentors/mentors.json
   * (that entry's `id`, e.g. "ilia") — as opposed to a mentor who
   * self-registered from scratch via /mentor/portal/register and builds
   * their public profile through this same account. A catalogue-linked
   * account's public face is (and stays) the curated catalogue entry, so it
   * skips the "fill out your public profile" gate entirely and is always
   * excluded from the portal→public-listing merge in lib/mentors.ts — filling
   * in photo/bio/etc. here would otherwise produce a second, duplicate card
   * under this account's phone-number id alongside the real catalogue card.
   */
  catalogueId?: string;
  /** Path under /public, e.g. "/mentors/portal/09121234567-photo-ab12cd34.jpg" — set once the mentor uploads a photo from /mentor/portal/profile. */
  photo?: string;
  /** e.g. "دندان‌پزشکی". */
  field?: string;
  /** Exact key into lib/universityLogos.ts's UNIVERSITY_LOGOS map, so the crest shows on their profile — picked from a fixed grid, not free text. */
  university?: string;
  /** Free text, e.g. "کنکور ۱۴۰۳ — رتبه ۸۱۸ منطقه دو". */
  rank?: string;
  /** One of "ریاضی" | "تجربی" | "انسانی" | "هنر/زبان" — must match the exam-track filter's values exactly (see features/discovery/components/ExamTrackTabs.tsx) or the mentor silently drops out of every track-filtered result. */
  track?: string;
  /** "آقا" | "خانم" — same exact-match requirement as track, against the gender filter. */
  gender?: string;
  bio?: string;
  journey?: string;
  lessons?: string;
  /** Exactly 3 when set — see isMentorProfileComplete. */
  helpsWith?: string[];
  /** 1 or 2 when set — see isMentorProfileComplete. */
  availabilityWindows?: string[];
  /** Path under /public, e.g. "/mentors/portal/09121234567-voice-ab12cd34.m4a" — the intro clip played on the public profile page. */
  voiceIntro?: string;
  /**
   * The founder's explicit go-ahead to show this self-registered mentor on
   * the public site. Registration is open to anyone who has the link (phone
   * + a password they pick, no SMS verification), so without this gate a
   * stranger could fill in the profile form and be listed to every visitor
   * as a vetted HamMasir mentor within seconds — see
   * isMentorPubliclyListed and /mentor/admin/mentors, where approval is
   * granted (and can be revoked again).
   *
   * Undefined counts as not approved. Accounts created before this field
   * existed were backfilled to `true` at deploy time so nobody already live
   * silently vanished — see deploy/README.md.
   */
  approved?: boolean;
  /** ISO timestamp of the approval decision — shown in the admin list so the founder can tell a fresh request from an old one. */
  approvedAt?: string;
}

/**
 * A self-registered mentor only shows up in the student-facing catalogue
 * (see lib/mentors.ts) once every field of the profile template is filled
 * in — half a profile is worse than no profile. `track`/`gender` are part of
 * that gate too: without them a mentor is technically listed but invisible
 * to the exam-track and gender filters (lib/mentorFilters.ts treats a
 * missing field as "never matches" for every filter except the quiz-derived
 * matchTags), which is functionally the same as not being listed for anyone
 * who taps a filter — the single most common thing a student does on the
 * discover screen.
 */
export function isMentorProfileComplete(mentor: MentorAccount): boolean {
  return Boolean(
    mentor.photo &&
      mentor.name &&
      mentor.field &&
      mentor.university &&
      mentor.rank &&
      mentor.track &&
      mentor.gender &&
      mentor.bio &&
      mentor.journey &&
      mentor.lessons &&
      mentor.helpsWith?.length === 3 &&
      mentor.helpsWith.every((item) => item.trim().length > 0) &&
      mentor.availabilityWindows?.length &&
      mentor.availabilityWindows.every((item) => item.trim().length > 0) &&
      mentor.voiceIntro,
  );
}

/**
 * The full gate for appearing in the student-facing catalogue: a finished
 * profile AND the founder's approval. Both halves matter and they fail
 * differently — an unfinished profile is the mentor's own to-do, an
 * unapproved one is waiting on the founder — so the portal reports them
 * separately (see /mentor/portal/profile) while every public read path just
 * calls this.
 */
export function isMentorPubliclyListed(mentor: MentorAccount): boolean {
  return isMentorProfileComplete(mentor) && mentor.approved === true;
}

export interface CancellationInfo {
  by: "student" | "mentor";
  /** Only ever collected from the student side — see cancelSession in features/sessions/actions.ts. A mentor cancelling is expected to have already coordinated with the founder directly, so no reason is asked for in-app. */
  reason?: string;
  at: string;
}

export interface PortalStudent {
  /** = phone number — same convention as MentorAccount.id, so one real phone identity can never end up with two disconnected portal records across devices. */
  id: string;
  phone: string;
  name: string;
  weekLabel?: string;
  sessions: string[];
  days: PlanDay[];
  /** The mentor's Google Meet link for this student — set from the mentor portal, opened by the student's "ورود به جلسه" button. Sessions are request-based (see slots.ts), not scheduled at an exact instant, so the button just opens this whenever it's set rather than gating on a specific time. */
  meetLink?: string;
  /** Set once either side cancels the relationship — see cancelSession (student) and cancelStudent (mentor). Kept on the record (rather than deleting it) so both sides still see who cancelled and why; cleared automatically if this phone books again (see ensureStudentSession). */
  cancelled?: CancellationInfo;
  /**
   * The catalogue/portal id of the mentor this subscription is with — set by
   * ensureStudentSession the moment a subscription booking succeeds, kept up
   * to date if the student ever subscribes to a different mentor. Without
   * this, the only place "who is my mentor" lived was the client-only
   * bookingsStore (localStorage), so /student/home and /student/progress
   * couldn't render the real, server-side session (weekly plan, Meet link)
   * for a student who logs in on a second device or a cleared browser — the
   * exact cross-device scenario phone+password login exists to solve.
   */
  mentorId?: string;
}

const MENTORS_FILE = "src/data/mentorPortal/mentors.json";
const STUDENTS_DIR = "src/data/mentorPortal/students";

/**
 * Mentor accounts (id = phone number) + one JSON file per student — the
 * whole mentor portal's data layer. No real database, but passwords are no
 * longer stored in the clear: registerMentorAccount hashes on the way in and
 * findMentorByCredentials upgrades any account still holding a legacy
 * plain-text password the next time its owner logs in (see lib/password.ts).
 * The session cookie is still just the mentor's id (unsigned), which is fine
 * for an internal tool the operator controls but isn't real security.
 * Accounts are created either by self-registration (see
 * /mentor/portal/register) or by editing mentors.json directly — a
 * hand-written plain-text password there still works and self-upgrades.
 */
export async function getMentorAccounts(): Promise<MentorAccount[]> {
  return readJson<MentorAccount[]>(MENTORS_FILE, []);
}

/**
 * Login lookup — matches by phone (id) *and* password, since with
 * self-registration two mentors could otherwise pick the same password.
 * Compares through normalizePersianText on both sides so a password typed
 * via an Arabic-layout keyboard at registration still matches the same
 * password typed via a Persian-layout one at login (or vice versa) — see
 * that function's doc comment for the exact characters this covers.
 *
 * The phone side goes through `digitsOnly` for the same reason: `id` is
 * stored as clean ASCII digits (the registration form's PhoneStep already
 * runs it through digitsOnly), but the portal's *login* page — a separate
 * component — never did, so a phone typed with a Persian-digit keyboard, or
 * with a stray space, compared strictly unequal to the stored id and failed
 * with a "شماره یا رمز اشتباهه" message that looked like a wrong password
 * but was actually never reaching a real comparison at all. Real incident:
 * mentors locked out of their own portal despite the right phone+password.
 */
export async function findMentorByCredentials(phone: string, password: string): Promise<MentorAccount | null> {
  const mentors = await getMentorAccounts();
  const normalizedPhone = digitsOnly(phone);

  // Looking the account up by id first and then checking the password is
  // equivalent to the old single-pass match (registerMentorAccount already
  // rejects a duplicate id), and it's what lets the check be async.
  const account = mentors.find((m) => m.id === normalizedPhone);
  if (!account || !(await verifyPassword(password, account.password))) return null;

  // Right password, still stored as plain text: this is the one moment the
  // real password is in hand, so upgrade it now. Best-effort — a failed
  // write must not turn a successful login into a failed one; the account
  // just stays legacy and gets another chance at the next login.
  if (!isHashed(account.password)) {
    try {
      const hashed = await hashPassword(password);
      await updateMentorAccount(account.id, { password: hashed });
      account.password = hashed;
    } catch {
      // keep the login working
    }
  }

  return account;
}

export async function getMentorById(id: string): Promise<MentorAccount | null> {
  const mentors = await getMentorAccounts();
  return mentors.find((m) => m.id === id) ?? null;
}

/** Resolves the logged-in mentor from the session cookie, or null if there isn't one / it's stale. */
export async function getSessionMentor(): Promise<MentorAccount | null> {
  const jar = await cookies();
  const id = jar.get(MENTOR_SESSION_COOKIE)?.value;
  if (!id) return null;
  return getMentorById(id);
}

function studentFilePath(id: string): string {
  return `${STUDENTS_DIR}/${id}.json`;
}

export async function getStudent(id: string): Promise<PortalStudent | null> {
  const raw = await readJson<unknown>(studentFilePath(id), null);
  if (!raw || typeof raw !== "object") return null;
  return raw as PortalStudent;
}

export async function saveStudent(student: PortalStudent): Promise<void> {
  await writeJson(studentFilePath(student.id), student);
}

/**
 * Read-modify-write a student record as one atomic unit (see lib/fileLock.ts)
 * — the pattern every mutating student action should go through instead of
 * its own separate getStudent+saveStudent pair, so a student ticking a task
 * and their mentor saving the plan at the same moment can never silently
 * clobber each other. Returns null (without calling `updater`) if the
 * student doesn't exist.
 */
export async function updateStudent(
  id: string,
  updater: (student: PortalStudent) => PortalStudent,
): Promise<PortalStudent | null> {
  return withFileLock(studentFilePath(id), async () => {
    const student = await getStudent(id);
    if (!student) return null;
    const updated = updater(student);
    await saveStudent(updated);
    return updated;
  });
}

async function saveMentorAccounts(mentors: MentorAccount[]): Promise<void> {
  await writeJson(MENTORS_FILE, mentors);
}

/** Self-registration entry point for the mentor portal — appends a new account (phone number as id) so the mentor can log in right away with the password they just chose. Caller is responsible for checking the phone isn't already registered — see registerMentorAccount for a race-safe check-and-append in one step. */
export async function addMentorAccount(mentor: MentorAccount): Promise<void> {
  await withFileLock(MENTORS_FILE, async () => {
    const mentors = await getMentorAccounts();
    mentors.push(mentor);
    await saveMentorAccounts(mentors);
  });
}

/**
 * Registers a new mentor account only if `phone` doesn't already have one —
 * the existence check and the append happen inside the same lock, so two
 * near-simultaneous registrations for the same phone can't both pass the
 * check and produce two accounts sharing an id (whichever password got
 * written second would silently lock the other registration out). Returns
 * false, without writing anything, if the phone was already taken.
 */
export async function registerMentorAccount(mentor: MentorAccount): Promise<boolean> {
  // Hashed here rather than at the call site so every caller — including any
  // future one — is covered without having to remember.
  const stored: MentorAccount = { ...mentor, password: await hashPassword(mentor.password) };
  return withFileLock(MENTORS_FILE, async () => {
    const mentors = await getMentorAccounts();
    if (mentors.some((m) => m.id === stored.id)) return false;
    mentors.push(stored);
    await saveMentorAccounts(mentors);
    return true;
  });
}

/**
 * The founder's approve / un-approve switch for a self-registered mentor
 * (see MentorAccount.approved) — the only thing that puts them on, or takes
 * them off, the public site. Revoking is deliberately non-destructive: the
 * account, its profile and its student roster all stay exactly as they
 * were, the card just stops being listed, so a mistaken approval can be
 * undone without asking the mentor to rebuild anything.
 *
 * Callers are responsible for revalidating the student-facing routes — see
 * /mentor/admin/mentors/actions.ts.
 */
export async function setMentorApproval(id: string, approved: boolean): Promise<void> {
  await updateMentorAccount(id, { approved, approvedAt: new Date().toISOString() });
}

/** Merges `patch` into mentor `id`'s account — used by the profile-completion step (photo/bio/voiceIntro) at /mentor/portal/profile. Does nothing if the id doesn't exist. */
export async function updateMentorAccount(id: string, patch: Partial<MentorAccount>): Promise<void> {
  await withFileLock(MENTORS_FILE, async () => {
    const mentors = await getMentorAccounts();
    const mentor = mentors.find((m) => m.id === id);
    if (!mentor) return;
    Object.assign(mentor, patch);
    await saveMentorAccounts(mentors);
  });
}

const CATALOGUE_MENTORS_FILE = "src/data/mentors/mentors.json";

/**
 * A booking's `mentorId` is the *catalogue* id (a slug like "ahmadreza") —
 * never a phone number, even once that same person later self-registers a
 * portal account (whose id is always their phone; see addMentorAccount).
 * Those two id spaces never collide on their own, so a catalogue mentor's
 * booking could never reach their own roster. This resolves the bridge:
 * if the curated catalogue entry for `mentorId` has been annotated with the
 * mentor's real phone (an optional `phone` field the founder adds by hand
 * once that mentor gets portal access — not part of the public Mentor type,
 * so it's never sent to the browser), that phone is the id to link against
 * instead. Read directly from the raw catalogue JSON (not lib/mentors.ts)
 * to avoid a circular import — that module already imports from this one.
 */
async function resolveMentorRosterId(mentorId: string): Promise<string> {
  const raw = await readJson<unknown>(CATALOGUE_MENTORS_FILE, []);
  if (!Array.isArray(raw)) return mentorId;
  const entry = raw.find((m) => m && typeof m === "object" && (m as Record<string, unknown>).id === mentorId);
  const phone = (entry as Record<string, unknown> | undefined)?.phone;
  return typeof phone === "string" && phone.trim() ? phone.trim() : mentorId;
}

/** Adds `studentId` to `mentorId`'s roster if that mentor has a portal account and doesn't already have them. Silently does nothing otherwise — not every catalogue mentor has portal access yet. */
async function addStudentToMentor(mentorId: string, studentId: string): Promise<void> {
  const rosterId = await resolveMentorRosterId(mentorId);
  await withFileLock(MENTORS_FILE, async () => {
    const mentors = await getMentorAccounts();
    const mentor = mentors.find((m) => m.id === rosterId);
    if (!mentor || mentor.studentIds.includes(studentId)) return;
    mentor.studentIds.push(studentId);
    await saveMentorAccounts(mentors);
  });
}

/** Resolves the logged-in student from the session cookie (their phone number), or null if there isn't one / it's stale. */
export async function getSessionStudent(): Promise<PortalStudent | null> {
  const phone = await getSessionPhone();
  if (!phone) return null;
  return getStudent(phone);
}

/**
 * Just the phone from the session cookie, with no PortalStudent lookup —
 * unlike getSessionStudent(), this is non-null for every logged-in student,
 * including one who's only ever booked a one-off session (no PortalStudent
 * record exists for them yet, but their cookie is still valid). Use this to
 * check "is the caller who they claim to be" in an API route (e.g.
 * /api/student-bookings, /api/payment-requests) before trusting a phone
 * number the client sent in the request itself.
 */
export async function getSessionPhone(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(STUDENT_SESSION_COOKIE)?.value ?? null;
}

/** Sets the student session cookie to `phone` — called on every successful phone+password auth (see /api/student-identity and its /login route), independent of whether a portal student record exists yet for that phone. This is what makes logging in on a second device pick up the same mentor-assigned plan instead of falling back to the shared demo one. */
export async function setStudentSessionCookie(phone: string): Promise<void> {
  const jar = await cookies();
  jar.set(STUDENT_SESSION_COOKIE, phone, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

function emptyWeekTemplate(): PlanDay[] {
  return WEEKDAY_LABELS.map((dayLabel) => ({ dayLabel, isToday: false, tasks: [] }));
}

/**
 * Called the moment a subscription booking succeeds (see PaymentForm).
 * Looked up by `phone` (not the session cookie) so the same real identity
 * always resolves to the same portal record no matter which device booked
 * it or whether that device's cookie survived — creates one (empty week —
 * the mentor fills it in from the portal) only if this phone truly has none
 * yet. Either way, links the student to `mentorId`'s portal roster if that
 * mentor has portal access. Idempotent: booking again (same or a different
 * mentor) reuses the existing student record.
 */
export async function ensureStudentSession(name: string, phone: string, mentorId: string): Promise<PortalStudent> {
  const student = await withFileLock(studentFilePath(phone), async () => {
    let s = await getStudent(phone);
    if (!s) {
      s = {
        id: phone,
        phone,
        name: name.trim() || "دانش‌آموز هم‌مسیر",
        sessions: [],
        days: emptyWeekTemplate(),
        mentorId,
      };
      await saveStudent(s);
    } else if (s.cancelled || s.mentorId !== mentorId) {
      // A new booking after a cancellation is a fresh start, not a
      // resurrection of the old (cancelled) relationship — otherwise this
      // phone would show as permanently cancelled even after
      // re-subscribing. Re-subscribing with a different mentor than before
      // also needs mentorId to move — it's the only server-side record of
      // "who is my current mentor".
      s = { ...s, cancelled: undefined, mentorId };
      await saveStudent(s);
    }
    return s;
  });

  await setStudentSessionCookie(phone);
  await addStudentToMentor(mentorId, phone);
  return student;
}
