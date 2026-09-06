"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CameraIcon, CheckIcon, UploadIcon } from "@/components/ui/icons";
import {
  finishMentorProfile,
  saveMentorIdentity,
  saveMentorStory,
  uploadMentorPhoto,
  uploadMentorVoice,
  type MentorIdentityInput,
  type MentorStoryInput,
} from "@/app/mentor/portal/profile/actions";
import { cn } from "@/lib/cn";
import { PHOTO_MAX_BYTES, VOICE_MAX_BYTES } from "@/lib/mentorPortalLimits";
import { UNIVERSITY_OPTIONS } from "@/lib/universityLogos";

const PHOTO_MAX_MB = PHOTO_MAX_BYTES / (1024 * 1024);
const VOICE_MAX_MB = VOICE_MAX_BYTES / (1024 * 1024);

interface MentorProfileFormProps {
  mentorName: string;
  /** True for a catalogue mentor revisiting an already-live profile to edit it — swaps the onboarding-flavored copy for an editing-flavored one. */
  isEditingLiveProfile?: boolean;
  initialPhoto?: string;
  initialField?: string;
  initialUniversity?: string;
  initialRank?: string;
  initialTrack?: string;
  initialGender?: string;
  initialBio?: string;
  initialJourney?: string;
  initialLessons?: string;
  initialHelpsWith?: string[];
  initialAvailabilityWindows?: string[];
  initialVoiceIntro?: string;
  /**
   * Whether the founder has approved this self-registered mentor for the
   * public site (see MentorAccount.approved). Always true for a
   * catalogue-linked mentor, who was never in the approval queue.
   */
  approved?: boolean;
}

/**
 * The gate every self-registered mentor has to clear before their listing
 * goes live for students (see isMentorProfileComplete in lib/mentorPortal.ts
 * and the catalogue filter in lib/mentors.ts): a photo, the full profile
 * template (bio -> journey -> lessons -> helpsWith -> availability), and a
 * voice intro. The "ادامه" button only unlocks once local state matches that
 * gate exactly, so it can never send a mentor forward with something missing.
 */
export function MentorProfileForm({
  mentorName,
  isEditingLiveProfile = false,
  initialPhoto,
  initialField,
  initialUniversity,
  initialRank,
  initialTrack,
  initialGender,
  initialBio,
  initialJourney,
  initialLessons,
  initialHelpsWith,
  initialAvailabilityWindows,
  initialVoiceIntro,
  approved = false,
}: MentorProfileFormProps) {
  const [photo, setPhoto] = useState(initialPhoto);
  const [identityDone, setIdentityDone] = useState(
    Boolean(initialField && initialUniversity && initialRank && initialTrack && initialGender),
  );
  const [storyDone, setStoryDone] = useState(
    Boolean(initialBio && initialJourney && initialLessons && initialHelpsWith?.length === 3 && initialAvailabilityWindows?.length),
  );
  const [voiceIntro, setVoiceIntro] = useState(initialVoiceIntro);

  const allSet = Boolean(photo && identityDone && storyDone && voiceIntro);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-h1 font-bold text-foreground">
          {isEditingLiveProfile ? `ویرایش پروفایل ${mentorName}` : `خوش اومدی ${mentorName}`}
        </h1>
        <p className="mt-1 text-caption text-muted-foreground">
          {isEditingLiveProfile
            ? "هر بخش رو جدا ذخیره کن — همون لحظه روی پروفایل عمومیت اعمال می‌شه."
            : "قبل از اینکه دانش‌آموزها بتونن پیدات کنن، این بخش‌ها رو کامل کن"}
        </p>
      </div>

      <p className="rounded-md bg-surface-alt px-3.5 py-2.5 text-caption font-semibold text-foreground">
        لطفاً همه‌ی حروف و اعداد رو به فارسی وارد کنید (مثلاً ۱۴۰۳ به‌جای 1403).
      </p>

      {/* A finished profile isn't a published one — approval is a separate,
          manual step (see MentorAccount.approved). Without saying so here, a
          mentor who filled everything in would search the site for their own
          card, not find it, and reasonably assume something broke. */}
      {!isEditingLiveProfile && !approved && (
        <p className="rounded-md border border-dashed border-border px-3.5 py-2.5 text-caption text-muted-foreground">
          {allSet
            ? "پروفایلت کامله و برای تایید فرستاده شد. به‌محض تایید، روی سایت منتشر می‌شه و دانش‌آموزها می‌تونن پیدات کنن."
            : "بعد از کامل شدن، پروفایلت برای تایید بررسی می‌شه و بعد روی سایت منتشر می‌شه."}
        </p>
      )}
      {!isEditingLiveProfile && approved && (
        <p className="rounded-md border border-dashed border-border px-3.5 py-2.5 text-caption text-muted-foreground">
          پروفایلت تایید شده و روی سایته — هر تغییری اینجا ذخیره کنی، همون لحظه روی پروفایل عمومیت اعمال می‌شه.
        </p>
      )}

      <PhotoSection photo={photo} onSaved={setPhoto} />
      <IdentitySection
        initialName={mentorName}
        initialField={initialField}
        initialUniversity={initialUniversity}
        initialRank={initialRank}
        initialTrack={initialTrack}
        initialGender={initialGender}
        done={identityDone}
        onSaved={() => setIdentityDone(true)}
      />
      <StorySection
        initialBio={initialBio}
        initialJourney={initialJourney}
        initialLessons={initialLessons}
        initialHelpsWith={initialHelpsWith}
        initialAvailabilityWindows={initialAvailabilityWindows}
        onSaved={() => setStoryDone(true)}
        done={storyDone}
      />
      <VoiceSection voiceIntro={voiceIntro} onSaved={setVoiceIntro} />

      <form action={finishMentorProfile}>
        <Button type="submit" size="lg" fullWidth disabled={!allSet}>
          {!allSet ? "اول همه‌ی بخش‌ها رو کامل کن" : isEditingLiveProfile ? "برگشت به پرتال" : "ادامه به پرتال"}
        </Button>
      </form>
    </div>
  );
}

function SectionHeader({ title, done }: { title: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        <CheckIcon className="h-3.5 w-3.5" />
      </span>
      <h2 className="text-body font-bold text-foreground">{title}</h2>
    </div>
  );
}

function textInputClasses() {
  return "w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-standard ease-gentle focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30";
}

function PhotoSection({ photo, onSaved }: { photo?: string; onSaved: (path: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(photo);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError(undefined);
    if (file.size > PHOTO_MAX_BYTES) {
      setError(`حجم عکس نباید بیشتر از ${PHOTO_MAX_MB} مگابایت باشه.`);
      return;
    }
    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.set("photo", file);
    startTransition(async () => {
      const result = await uploadMentorPhoto(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.path) onSaved(result.path);
    });
  }

  return (
    <Card className="flex flex-col gap-3">
      <SectionHeader title="عکس پروفایل" done={Boolean(photo)} />
      <p className="text-caption text-muted-foreground">
        لطفاً عکسی که ارسال می‌کنید فقط چهره رو شامل بشه و نزدیک و واضح باشه.
        <br />
        خانم‌ها هم حجاب رو اولویت بدن که تخته نشیم.
        <br />
        حداکثر حجم: {PHOTO_MAX_MB} مگابایت (jpg، png یا webp).
      </p>

      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground">
          {preview ? (
            <Image src={preview} alt="" width={64} height={64} className="h-full w-full object-cover" unoptimized />
          ) : (
            <CameraIcon className="h-6 w-6" />
          )}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <Button type="button" variant="outline" size="md" disabled={isPending} onClick={() => inputRef.current?.click()}>
          {isPending ? "در حال آپلود…" : photo ? "تعویض عکس" : "انتخاب عکس"}
        </Button>
      </div>

      {error && <p className="text-caption font-semibold text-danger">{error}</p>}
    </Card>
  );
}

const TRACK_OPTIONS = ["ریاضی", "تجربی", "انسانی", "هنر/زبان"];
const GENDER_OPTIONS = ["آقا", "خانم"];

interface IdentitySectionProps {
  initialName: string;
  initialField?: string;
  initialUniversity?: string;
  initialRank?: string;
  initialTrack?: string;
  initialGender?: string;
  done: boolean;
  onSaved: () => void;
}

function IdentitySection({
  initialName,
  initialField,
  initialUniversity,
  initialRank,
  initialTrack,
  initialGender,
  done,
  onSaved,
}: IdentitySectionProps) {
  const [name, setName] = useState(initialName);
  const [field, setField] = useState(initialField ?? "");
  const [university, setUniversity] = useState(initialUniversity ?? "");
  const [otherUniversity, setOtherUniversity] = useState(
    initialUniversity && !UNIVERSITY_OPTIONS.some((u) => u.name === initialUniversity) ? initialUniversity : "",
  );
  const [showOtherUniversity, setShowOtherUniversity] = useState(Boolean(otherUniversity));
  const [rank, setRank] = useState(initialRank ?? "");
  const [track, setTrack] = useState(initialTrack ?? "");
  const [gender, setGender] = useState(initialGender ?? "");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const effectiveUniversity = showOtherUniversity ? otherUniversity : university;
  const canSave =
    name.trim().length > 0 &&
    field.trim().length > 0 &&
    effectiveUniversity.trim().length > 0 &&
    rank.trim().length > 0 &&
    track.length > 0 &&
    gender.length > 0;

  function handleSave() {
    setError(undefined);
    const input: MentorIdentityInput = { name, field, university: effectiveUniversity, rank, track, gender };
    startTransition(async () => {
      const result = await saveMentorIdentity(input);
      if (result.error) {
        setError(result.error);
        return;
      }
      onSaved();
    });
  }

  return (
    <Card className="flex flex-col gap-5">
      <SectionHeader title="مشخصات" done={done} />

      <div className="flex flex-col gap-2">
        <p className="text-caption font-bold text-foreground">اسم کامل</p>
        <input value={name} onChange={(e) => setName(e.target.value)} className={textInputClasses()} placeholder="اسم و فامیل" />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-caption font-bold text-foreground">رشته و دانشگاه</p>
        <input value={field} onChange={(e) => setField(e.target.value)} className={textInputClasses()} placeholder="مثلاً: دندان‌پزشکی" />

        <div className="grid grid-cols-4 gap-2.5">
          {UNIVERSITY_OPTIONS.map((option) => {
            const selected = !showOtherUniversity && university === option.name;
            return (
              <button
                key={option.name}
                type="button"
                onClick={() => {
                  setShowOtherUniversity(false);
                  setUniversity(option.name);
                }}
                aria-pressed={selected}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-md border p-2 text-center transition-all duration-standard ease-gentle active:scale-[0.97]",
                  selected ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-primary-light",
                )}
              >
                <Image src={option.logo} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
                <span className="text-[10px] font-semibold leading-tight text-foreground">{option.name}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowOtherUniversity(true)}
            aria-pressed={showOtherUniversity}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 rounded-md border p-2 text-center transition-all duration-standard ease-gentle active:scale-[0.97]",
              showOtherUniversity ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-primary-light",
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center text-lg font-bold text-muted-foreground">+</span>
            <span className="text-[10px] font-semibold leading-tight text-foreground">دانشگاه دیگه</span>
          </button>
        </div>

        {showOtherUniversity && (
          <input
            value={otherUniversity}
            onChange={(e) => setOtherUniversity(e.target.value)}
            className={textInputClasses()}
            placeholder="اسم دانشگاهت رو بنویس"
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-caption font-bold text-foreground">رتبه و منطقه</p>
        <input
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          className={textInputClasses()}
          placeholder="مثلاً: کنکور ۱۴۰۳ — رتبه ۸۱۸ منطقه دو"
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-caption font-bold text-foreground">رشته‌ی کنکورت</p>
        <p className="text-caption text-muted-foreground">
          دانش‌آموزها می‌تونن بر اساس همین فیلتر کنن — بدونش تو نتیجه‌ی هیچ فیلتری پیدات نمی‌کنن.
        </p>
        <div className="flex flex-wrap gap-2">
          {TRACK_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTrack(option)}
              aria-pressed={track === option}
              className={cn(
                "rounded-full border px-3.5 py-2 text-caption font-semibold transition-all duration-standard ease-gentle active:scale-[0.97]",
                track === option ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-foreground hover:border-primary-light",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-caption font-bold text-foreground">جنسیت</p>
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setGender(option)}
              aria-pressed={gender === option}
              className={cn(
                "rounded-full border px-3.5 py-2 text-caption font-semibold transition-all duration-standard ease-gentle active:scale-[0.97]",
                gender === option ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-foreground hover:border-primary-light",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-caption font-semibold text-danger">{error}</p>}
      <Button type="button" variant="outline" size="md" disabled={!canSave || isPending} onClick={handleSave}>
        {isPending ? "در حال ذخیره…" : "ذخیره‌ی مشخصات"}
      </Button>
    </Card>
  );
}

interface StorySectionProps {
  initialBio?: string;
  initialJourney?: string;
  initialLessons?: string;
  initialHelpsWith?: string[];
  initialAvailabilityWindows?: string[];
  done: boolean;
  onSaved: () => void;
}

function StorySection({
  initialBio,
  initialJourney,
  initialLessons,
  initialHelpsWith,
  initialAvailabilityWindows,
  done,
  onSaved,
}: StorySectionProps) {
  const [bio, setBio] = useState(initialBio ?? "");
  const [journey, setJourney] = useState(initialJourney ?? "");
  const [lessons, setLessons] = useState(initialLessons ?? "");
  const [helpsWith, setHelpsWith] = useState<[string, string, string]>([
    initialHelpsWith?.[0] ?? "",
    initialHelpsWith?.[1] ?? "",
    initialHelpsWith?.[2] ?? "",
  ]);
  const [availability, setAvailability] = useState<[string, string]>([
    initialAvailabilityWindows?.[0] ?? "",
    initialAvailabilityWindows?.[1] ?? "",
  ]);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const canSave = useMemo(
    () =>
      bio.trim().length > 0 &&
      journey.trim().length > 0 &&
      lessons.trim().length > 0 &&
      helpsWith.every((item) => item.trim().length > 0) &&
      availability[0].trim().length > 0,
    [bio, journey, lessons, helpsWith, availability],
  );

  function setHelpsWithAt(index: number, value: string) {
    setHelpsWith((prev) => {
      const next = [...prev] as [string, string, string];
      next[index] = value;
      return next;
    });
  }

  function setAvailabilityAt(index: number, value: string) {
    setAvailability((prev) => {
      const next = [...prev] as [string, string];
      next[index] = value;
      return next;
    });
  }

  function handleSave() {
    setError(undefined);
    const input: MentorStoryInput = {
      bio,
      journey,
      lessons,
      helpsWith: [...helpsWith],
      availabilityWindows: availability.filter((item) => item.trim().length > 0),
    };
    startTransition(async () => {
      const result = await saveMentorStory(input);
      if (result.error) {
        setError(result.error);
        return;
      }
      onSaved();
    });
  }

  return (
    <Card className="flex flex-col gap-6">
      <SectionHeader title="متن پروفایل" done={done} />

      <div className="flex flex-col gap-2">
        <p className="text-caption font-bold text-foreground">۱. بیو</p>
        <p className="text-caption text-muted-foreground">
          [رشته تحصیلی] [دانشگاه] می‌خونم + [هوک از یه تجربه یا ویژگی خاص]
        </p>
        <p className="text-caption text-muted-foreground">
          مثال: «عمران دانشگاه تهران می‌خونم؛ تا آخر دوازدهم اصلاً به شیمی دست نزده بودم.»
        </p>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className={textInputClasses()} placeholder="بیوی خودت رو بنویس..." />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-caption font-bold text-foreground">۲. داستان مسیرت</p>
        <p className="text-caption text-muted-foreground">
          یه لحظه یا دوره‌ی مشخص و سخت از مسیرت — چی شد، چرا سخت بود، دقیقاً کِی. ۲ تا ۴ جمله، با جزئیات واقعی.
        </p>
        <p className="text-caption text-muted-foreground">
          مثال: «از مهر دوازدهم شروع کردم، یعنی فقط ۹ ماه به کنکور، و شیمی همیشه غولم بود. آخرین آزمون جمع‌بندی پاییز، درصدم شد ۱۵ و همون‌جا فرو ریختم.»
        </p>
        <textarea value={journey} onChange={(e) => setJourney(e.target.value)} rows={3} className={textInputClasses()} placeholder="داستان مسیرت رو بنویس..." />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-caption font-bold text-foreground">۳. درسی که گرفتی</p>
        <p className="text-caption text-muted-foreground">
          چیزی که از اون تجربه یاد گرفتی، خطاب به دانش‌آموز، نه به خودت. ۱ تا ۲ جمله.
        </p>
        <p className="text-caption text-muted-foreground">
          مثال: «چیزی که نگهم داشت این بود که اهل باختنِ خودم نیستم. زودتر شروع کن و قدر هر ثانیه رو بدون، دیر شروع کردن جبران‌شدنیه، ولی ارزون نیست.»
        </p>
        <textarea value={lessons} onChange={(e) => setLessons(e.target.value)} rows={2} className={textInputClasses()} placeholder="درسی که گرفتی رو بنویس..." />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-caption font-bold text-foreground">۴. به چه کسایی کمک می‌کنی</p>
        <p className="text-caption text-muted-foreground">دقیقاً ۳ آیتم کوتاه (۳ تا ۶ کلمه)، فقط عبارت نه جمله.</p>
        <p className="text-caption text-muted-foreground">
          مثال: «کسایی که دیر شروع کردن» / «کسایی که با معلم یا مشاورشون مشکل داشتن» / «کسایی که مشکل تمرکز دارن»
        </p>
        {helpsWith.map((value, i) => (
          <input
            key={i}
            value={value}
            onChange={(e) => setHelpsWithAt(i, e.target.value)}
            className={textInputClasses()}
            placeholder={`مورد ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-caption font-bold text-foreground">۵. زمان‌های در دسترس</p>
        <p className="text-caption text-muted-foreground">۱ تا ۲ آیتم کوتاه، بازه‌ی کلی نه ساعت دقیق.</p>
        <p className="text-caption text-muted-foreground">مثال: «شب‌ها بعد از ساعت ۲۱» / «پنجشنبه و جمعه»</p>
        <input
          value={availability[0]}
          onChange={(e) => setAvailabilityAt(0, e.target.value)}
          className={textInputClasses()}
          placeholder="مثلاً: شب‌ها بعد از ساعت ۲۱"
        />
        <input
          value={availability[1]}
          onChange={(e) => setAvailabilityAt(1, e.target.value)}
          className={textInputClasses()}
          placeholder="اختیاری — مثلاً: پنجشنبه و جمعه"
        />
      </div>

      {error && <p className="text-caption font-semibold text-danger">{error}</p>}
      <Button type="button" variant="outline" size="md" disabled={!canSave || isPending} onClick={handleSave}>
        {isPending ? "در حال ذخیره…" : "ذخیره‌ی متن پروفایل"}
      </Button>
    </Card>
  );
}

function VoiceSection({ voiceIntro, onSaved }: { voiceIntro?: string; onSaved: (path: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError(undefined);
    if (file.size > VOICE_MAX_BYTES) {
      setError(`حجم ویس نباید بیشتر از ${VOICE_MAX_MB} مگابایت باشه.`);
      return;
    }
    const formData = new FormData();
    formData.set("voice", file);
    startTransition(async () => {
      const result = await uploadMentorVoice(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.path) onSaved(result.path);
    });
  }

  return (
    <Card className="flex flex-col gap-3">
      <SectionHeader title="ویس معرفی" done={Boolean(voiceIntro)} />
      <p className="text-caption text-muted-foreground">
        یه ویس معرفی بفرست که این‌ها توش باشه: اسمت، رتبه‌ی کنکورت، رشته و دانشگاه فعلیت، سال کنکورت.
        <br />
        حداکثر حجم: {VOICE_MAX_MB} مگابایت.
      </p>

      <audio controls src="/sample-voice-intro.m4a" className="w-full" />
      <p className="text-caption text-muted-foreground">این یه نمونه‌ست، صدای خودت رو بفرست.</p>

      {voiceIntro && <audio controls src={voiceIntro} className="w-full" />}

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <Button type="button" variant="outline" size="md" disabled={isPending} onClick={() => inputRef.current?.click()}>
        <UploadIcon className="h-4 w-4" />
        {isPending ? "در حال آپلود…" : voiceIntro ? "تعویض ویس" : "آپلود ویس"}
      </Button>

      {error && <p className="text-caption font-semibold text-danger">{error}</p>}
    </Card>
  );
}
