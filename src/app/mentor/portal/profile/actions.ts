"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionMentor, updateMentorAccount } from "@/lib/mentorPortal";
import { updateCatalogueMentor } from "@/lib/mentors";
import { PHOTO_MAX_BYTES, VOICE_MAX_BYTES } from "@/lib/mentorPortalLimits";
import { fastStartMp4 } from "@/lib/mp4FastStart";

const PORTAL_MEDIA_DIR = path.join(process.cwd(), "public/mentors/portal");

const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const VOICE_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "audio/webm": "weba",
};

async function saveUpload(
  file: File,
  mentorId: string,
  suffix: string,
  extensionsByType: Record<string, string>,
  transform?: (buf: Buffer) => Buffer,
) {
  const ext = extensionsByType[file.type];
  if (!ext) return null;

  await mkdir(PORTAL_MEDIA_DIR, { recursive: true });
  let bytes: Buffer = Buffer.from(await file.arrayBuffer());
  if (transform) bytes = transform(bytes);

  // Cache-busting id in the filename — re-uploading a photo/voice should
  // show the new one immediately, not a stale cached copy at the old path.
  const filename = `${mentorId}-${suffix}-${randomUUID().slice(0, 8)}.${ext}`;
  await writeFile(path.join(PORTAL_MEDIA_DIR, filename), bytes);
  return `/mentors/portal/${filename}`;
}

/** m4a/mp4 uploads (phone voice memos, most commonly) can have `moov` at the end of the file, which breaks HTML5 <audio> playback — see lib/mp4FastStart.ts. Other formats (mp3/ogg/wav/webm) don't have this failure mode, so they pass through untouched. */
const MP4_VOICE_TYPES = new Set(["audio/mp4", "audio/x-m4a"]);

function maybeFastStart(mimeType: string) {
  return MP4_VOICE_TYPES.has(mimeType) ? fastStartMp4 : undefined;
}

export async function uploadMentorPhoto(formData: FormData): Promise<{ error?: string; path?: string }> {
  const mentor = await getSessionMentor();
  if (!mentor) return { error: "لطفاً دوباره وارد شو." };

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) return { error: "یه عکس انتخاب کن." };
  if (file.size > PHOTO_MAX_BYTES) return { error: "حجم عکس نباید بیشتر از ۲ مگابایت باشه." };

  const savedPath = await saveUpload(file, mentor.id, "photo", PHOTO_TYPES);
  if (!savedPath) return { error: "فقط فرمت jpg، png یا webp قبول می‌شه." };

  await updateMentorAccount(mentor.id, { photo: savedPath });
  if (mentor.catalogueId) await updateCatalogueMentor(mentor.catalogueId, { photo: savedPath });
  revalidatePath("/student", "layout");
  return { path: savedPath };
}

const VALID_TRACKS = new Set(["ریاضی", "تجربی", "انسانی", "هنر/زبان"]);
const VALID_GENDERS = new Set(["آقا", "خانم"]);

export interface MentorIdentityInput {
  name: string;
  field: string;
  university: string;
  rank: string;
  track: string;
  gender: string;
}

/**
 * Saves the identity block (full name, field, university crest, rank/region,
 * exam track, gender) — shown at the top of the public profile the same way
 * as every curated catalogue mentor's. `track`/`gender` have to match the
 * discover screen's filter values exactly (see MentorAccount.track's own doc
 * comment) — validated here, not just in the form's chip UI, since a mentor
 * without them is invisible to anyone who taps a filter (see
 * isMentorProfileComplete).
 */
export async function saveMentorIdentity(input: MentorIdentityInput): Promise<{ error?: string }> {
  const mentor = await getSessionMentor();
  if (!mentor) return { error: "لطفاً دوباره وارد شو." };

  const name = input.name.trim();
  const field = input.field.trim();
  const university = input.university.trim();
  const rank = input.rank.trim();
  const track = input.track.trim();
  const gender = input.gender.trim();

  if (!name) return { error: "اسم کامل رو وارد کن." };
  if (!field) return { error: "رشته‌ت رو وارد کن." };
  if (!university) return { error: "دانشگاهت رو انتخاب کن." };
  if (!rank) return { error: "رتبه و منطقه‌ت رو وارد کن." };
  if (!VALID_TRACKS.has(track)) return { error: "رشته‌ی کنکورت رو انتخاب کن." };
  if (!VALID_GENDERS.has(gender)) return { error: "جنسیتت رو انتخاب کن." };

  await updateMentorAccount(mentor.id, { name, field, university, rank, track, gender });
  if (mentor.catalogueId) await updateCatalogueMentor(mentor.catalogueId, { name, field, university, rank, track, gender });
  revalidatePath("/student", "layout");
  return {};
}

export interface MentorStoryInput {
  bio: string;
  journey: string;
  lessons: string;
  /** Must be exactly 3 non-empty items, matching the profile template's "به چه کسایی کمک می‌کنی" section. */
  helpsWith: string[];
  /** 1 or 2 non-empty items, matching the template's "زمان‌های در دسترس" section. */
  availabilityWindows: string[];
}

/** Saves every text field of the profile template (canon: bio -> journey -> lessons -> helpsWith -> availability) in one shot — they're one cohesive "write your story" step, not five separate saves. */
export async function saveMentorStory(input: MentorStoryInput): Promise<{ error?: string }> {
  const mentor = await getSessionMentor();
  if (!mentor) return { error: "لطفاً دوباره وارد شو." };

  const bio = input.bio.trim();
  const journey = input.journey.trim();
  const lessons = input.lessons.trim();
  const helpsWith = input.helpsWith.map((item) => item.trim());
  const availabilityWindows = input.availabilityWindows.map((item) => item.trim()).filter(Boolean);

  if (!bio) return { error: "بیو رو بنویس." };
  if (!journey) return { error: "داستان مسیرت رو بنویس." };
  if (!lessons) return { error: "درسی که گرفتی رو بنویس." };
  if (helpsWith.length !== 3 || helpsWith.some((item) => !item)) return { error: "دقیقاً ۳ مورد برای «به چه کسایی کمک می‌کنی» لازمه." };
  if (availabilityWindows.length === 0) return { error: "حداقل یه زمان در دسترس بنویس." };

  await updateMentorAccount(mentor.id, { bio, journey, lessons, helpsWith, availabilityWindows });
  if (mentor.catalogueId) await updateCatalogueMentor(mentor.catalogueId, { bio, journey, lessons, helpsWith, availabilityWindows });
  revalidatePath("/student", "layout");
  return {};
}

export async function uploadMentorVoice(formData: FormData): Promise<{ error?: string; path?: string }> {
  const mentor = await getSessionMentor();
  if (!mentor) return { error: "لطفاً دوباره وارد شو." };

  const file = formData.get("voice");
  if (!(file instanceof File) || file.size === 0) return { error: "یه فایل صوتی انتخاب کن." };
  if (file.size > VOICE_MAX_BYTES) return { error: "حجم ویس نباید بیشتر از ۳ مگابایت باشه." };

  const savedPath = await saveUpload(file, mentor.id, "voice", VOICE_TYPES, maybeFastStart(file.type));
  if (!savedPath) return { error: "فرمت فایل صوتی پشتیبانی نمی‌شه." };

  await updateMentorAccount(mentor.id, { voiceIntro: savedPath });
  if (mentor.catalogueId) await updateCatalogueMentor(mentor.catalogueId, { voiceIntro: savedPath });
  revalidatePath("/student", "layout");
  return { path: savedPath };
}

/** Called once every field of the profile template is set — sends the mentor on to their actual portal home. */
export async function finishMentorProfile(): Promise<void> {
  redirect("/mentor/portal/students");
}
