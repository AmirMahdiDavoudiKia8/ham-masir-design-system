import { readdir, readFile, writeFile } from "node:fs/promises";
import { revalidateTag, unstable_cache } from "next/cache";
import path from "node:path";
import { withFileLock } from "@/lib/fileLock";
import type { Mentor, MentorReview } from "@/lib/mentorFilters";
import { getMentorAccounts, isMentorPubliclyListed } from "@/lib/mentorPortal";
import { SITE_SESSION_PRICE, SITE_SUBSCRIPTION_PRICE } from "@/lib/plans";

export type { Mentor, MentorFilters } from "@/lib/mentorFilters";
export { filterMentors, parseRankValue } from "@/lib/mentorFilters";

const MENTORS_DIR = path.join(process.cwd(), "src/data/mentors");

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function bool(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function strArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const cleaned = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  return cleaned.length > 0 ? cleaned : undefined;
}

function matchTags(value: unknown): Mentor["matchTags"] {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  const mainProblem = strArray(v.mainProblem);
  const distraction = strArray(v.distraction);
  if (!mainProblem && !distraction) return undefined;
  return { mainProblem, distraction };
}

function reviews(value: unknown): MentorReview[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const cleaned = value
    .map((raw, i): MentorReview | null => {
      if (!raw || typeof raw !== "object") return null;
      const r = raw as Record<string, unknown>;
      const text = str(r.text);
      const rating = num(r.rating);
      if (!text || rating === undefined) return null;
      return {
        id: str(r.id) ?? `review-${i}`,
        text,
        authorLabel: str(r.authorLabel) ?? "دانش‌آموز هم‌مسیر",
        rating,
      };
    })
    .filter((r): r is MentorReview => r !== null);
  return cleaned.length > 0 ? cleaned : undefined;
}

function normalizeMentor(raw: unknown, fallbackId: string): Mentor | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  return {
    id: str(r.id) ?? fallbackId,
    name: str(r.name),
    photo: str(r.photo),
    verified: bool(r.verified),
    field: str(r.field),
    university: str(r.university),
    rank: str(r.rank),
    rating: num(r.rating),
    reviewsCount: num(r.reviewsCount),
    sessionPrice: str(r.sessionPrice),
    subscriptionPrice: str(r.subscriptionPrice),
    track: str(r.track),
    gender: str(r.gender),
    availableSlots: strArray(r.availableSlots),
    bio: str(r.bio),
    journey: str(r.journey),
    lessons: str(r.lessons),
    helpsWith: strArray(r.helpsWith),
    availabilityWindows: strArray(r.availabilityWindows),
    reviews: reviews(r.reviews),
    matchTags: matchTags(r.matchTags),
    voiceIntro: str(r.voiceIntro),
  };
}

/**
 * Self-registered mentor-portal accounts (see /mentor/portal/register)
 * appended to the catalogue once their profile is complete AND the founder
 * has approved them (see isMentorPubliclyListed) — id = the phone number
 * they registered with, so a booking's mentorId lines up with their
 * mentorPortal account (roster linking, sheet matching).
 *
 * Both halves of that gate exist for a reason. A mentor who hasn't uploaded
 * a photo/bio/voice intro yet is excluded because a half-filled card isn't
 * something a student should be able to book. And approval is what keeps
 * the *open* registration link from being a self-serve publish button:
 * anyone who has the URL can create an account with a phone number and a
 * password of their choosing (no SMS verification anywhere in that flow),
 * so without it a stranger — or a competitor, or a troll — could put
 * themselves in front of every visitor as a vetted HamMasir mentor,
 * bookable, within a couple of minutes. Approval happens at
 * /mentor/admin/mentors.
 *
 * Curated catalogue entries win on id collision — an admin-curated profile
 * (src/data/mentors/mentors.json) is always richer than the self-service
 * one for the same phone number.
 *
 * Accounts with `catalogueId` set are excluded outright, complete or not —
 * those belong to a mentor who already has a curated catalogue card; their
 * portal account exists only for roster/plan access, never a public listing
 * of its own (see the doc comment on MentorAccount.catalogueId).
 */
async function loadPortalMentors(): Promise<Mentor[]> {
  const accounts = await getMentorAccounts();
  return accounts
    .filter((account) => !account.catalogueId && isMentorPubliclyListed(account))
    .map((account) => ({
      id: account.id,
      name: account.name,
      photo: account.photo,
      field: account.field,
      university: account.university,
      rank: account.rank,
      bio: account.bio,
      journey: account.journey,
      lessons: account.lessons,
      helpsWith: account.helpsWith,
      availabilityWindows: account.availabilityWindows,
      voiceIntro: account.voiceIntro,
      track: account.track,
      gender: account.gender,
      // MentorAccount has no price fields of its own — every mentor on the
      // site charges the same amount, so this stamps the fixed site price
      // on instead of leaving it blank (see SITE_SESSION_PRICE's own doc
      // comment for why a per-mentor field would be redundant here).
      sessionPrice: SITE_SESSION_PRICE,
      subscriptionPrice: SITE_SUBSCRIPTION_PRICE,
    }));
}

/**
 * Reads mentors from src/data/mentors/ — either a single mentors.json
 * (array of mentor objects) or one .json file per mentor — merged with
 * self-registered mentor-portal accounts (loadPortalMentors). Local data
 * only, no network, no backend. Never throws: any read/parse failure
 * degrades to an empty list so the screen can show its empty state instead
 * of crashing.
 *
 * This is the ONE place every screen gets mentor data from — always by
 * `id`, never re-declared locally. TODO: this is the seam where a real
 * backend replaces the local read (e.g. an API call), without any screen
 * needing to change — they only ever depend on this function's shape.
 *
 * Server-only (reads the filesystem) — client components that need
 * `Mentor`/`MentorFilters`/`filterMentors` should import them from
 * lib/mentorFilters instead, so the browser bundle never sees node:fs.
 */
async function loadCatalogueMentors(): Promise<Mentor[]> {
  let files: string[];
  try {
    files = (await readdir(MENTORS_DIR)).filter((f) => f.toLowerCase().endsWith(".json"));
  } catch {
    return [];
  }
  if (files.length === 0) return [];

  const singleFile = files.find((f) => f.toLowerCase() === "mentors.json");

  if (singleFile) {
    try {
      const raw = JSON.parse(await readFile(path.join(MENTORS_DIR, singleFile), "utf-8"));
      if (!Array.isArray(raw)) return [];
      return raw
        .map((item, i) => normalizeMentor(item, `mentor-${i}`))
        .filter((m): m is Mentor => m !== null);
    } catch {
      return [];
    }
  }

  const mentors = await Promise.all(
    files.map(async (file) => {
      try {
        const raw = JSON.parse(await readFile(path.join(MENTORS_DIR, file), "utf-8"));
        return normalizeMentor(raw, file.replace(/\.json$/i, ""));
      } catch {
        return null;
      }
    }),
  );

  return mentors.filter((m): m is Mentor => m !== null);
}

/**
 * Cached read of the curated catalogue file — the disk read + JSON parse
 * happens once per hour (matches how often that file actually changes)
 * instead of on every request. Cheap on any host, but especially worth it
 * on a low-spec one.
 */
const getCachedCatalogueMentors = unstable_cache(loadCatalogueMentors, ["mentors"], {
  revalidate: 3600,
  tags: ["mentors"],
});

const CATALOGUE_FILE = path.join(MENTORS_DIR, "mentors.json");

/**
 * Lets a catalogue mentor (see MentorAccount.catalogueId) edit their own
 * public profile through the portal instead of only an admin editing the
 * repo file directly. Patches the matching entry by `id` in-place, keeping
 * every field this function doesn't touch (reviews, rating, matchTags,
 * etc. — the curated extras a self-service form never asks for).
 *
 * Only mentors.json's single-file layout is supported here (the one this
 * project actually uses) — the per-file layout loadCatalogueMentors also
 * reads is legacy-compatible only for reads.
 *
 * IMPORTANT: mentors.json ships as part of the build (src/data/), so a
 * write here must be mirrored by a persistent-storage symlink on the VPS
 * (see deploy/README.md) — the exact same silent-reset failure mode as
 * every other src/data/*.json this project writes to at runtime.
 */
export async function updateCatalogueMentor(catalogueId: string, patch: Partial<Mentor>): Promise<boolean> {
  return withFileLock(CATALOGUE_FILE, async () => {
    let raw: unknown;
    try {
      raw = JSON.parse(await readFile(CATALOGUE_FILE, "utf-8"));
    } catch {
      return false;
    }
    if (!Array.isArray(raw)) return false;

    const index = raw.findIndex((m) => m && typeof m === "object" && (m as Record<string, unknown>).id === catalogueId);
    if (index === -1) return false;

    raw[index] = { ...(raw[index] as Record<string, unknown>), ...patch };
    await writeFile(CATALOGUE_FILE, `${JSON.stringify(raw, null, 2)}
`, "utf-8");
    revalidateTag("mentors");
    return true;
  });
}

/**
 * Entry point every screen actually calls. Portal accounts are read fresh
 * on every call (not through the hour-long cache above) — self-registration
 * needs to show up in discover/booking right away, not up to an hour later.
 */
export async function getMentors(): Promise<Mentor[]> {
  const [catalogueMentors, portalMentors] = await Promise.all([getCachedCatalogueMentors(), loadPortalMentors()]);
  const catalogueIds = new Set(catalogueMentors.map((m) => m.id));
  return [...catalogueMentors, ...portalMentors.filter((m) => !catalogueIds.has(m.id))];
}

/** One catalogue entry by id — for the portal profile-edit screen, which only ever needs its own mentor's curated card, not the whole list. */
export async function getCatalogueMentorById(id: string): Promise<Mentor | undefined> {
  const catalogueMentors = await getCachedCatalogueMentors();
  return catalogueMentors.find((m) => m.id === id);
}
