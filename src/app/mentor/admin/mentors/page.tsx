import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/adminAuth";
import { ApprovalButton } from "@/features/adminMentors/ApprovalButton";
import { toPersianDigits } from "@/lib/format";
import { getMentorAccounts, isMentorProfileComplete, type MentorAccount } from "@/lib/mentorPortal";

// Reads live off-disk data on every request — must never be statically
// prerendered, same reasoning as every other /mentor/admin/* page.
export const dynamic = "force-dynamic";

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const formatted = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
  return toPersianDigits(formatted);
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-label font-bold text-muted-foreground">{label}</span>
      <span className="whitespace-pre-wrap text-caption text-foreground">{value}</span>
    </div>
  );
}

/**
 * Everything the founder needs to decide whether this person should be in
 * front of students — rendered inline rather than linking to their public
 * profile page, because an unapproved mentor has no public page yet (that's
 * the whole point of this screen).
 */
function MentorCard({ mentor }: { mentor: MentorAccount }) {
  const decidedAt = formatDate(mentor.approvedAt);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {mentor.photo && (
            // eslint-disable-next-line @next/next/no-img-element -- runtime upload path, not a build-time asset
            <img src={mentor.photo} alt="" className="size-14 shrink-0 rounded-full object-cover" />
          )}
          <div className="flex flex-col gap-0.5">
            <span className="text-body font-bold text-foreground">{mentor.name || "بدون اسم"}</span>
            <span dir="ltr" className="text-caption text-muted-foreground">
              {toPersianDigits(mentor.id)}
            </span>
          </div>
        </div>
        {isMentorProfileComplete(mentor) && <ApprovalButton mentorId={mentor.id} approved={mentor.approved === true} />}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="رشته" value={mentor.field} />
        <Field label="دانشگاه" value={mentor.university} />
        <Field label="رتبه" value={mentor.rank} />
        <Field label="رشته کنکور" value={mentor.track} />
        <Field label="جنسیت" value={mentor.gender} />
        <Field label="تعداد دانش‌آموز" value={toPersianDigits(mentor.studentIds.length)} />
      </div>

      <Field label="بیو" value={mentor.bio} />
      <Field label="داستان مسیر" value={mentor.journey} />
      <Field label="درسی که گرفته" value={mentor.lessons} />
      <Field label="به چه کسایی کمک می‌کنه" value={mentor.helpsWith?.join(" • ")} />
      <Field label="زمان‌های در دسترس" value={mentor.availabilityWindows?.join(" • ")} />

      {mentor.voiceIntro && (
        <div className="flex flex-col gap-1">
          <span className="text-label font-bold text-muted-foreground">ویس معرفی</span>
          <audio controls preload="none" src={mentor.voiceIntro} className="w-full" />
        </div>
      )}

      {decidedAt && (
        <span className="text-label text-muted-foreground">
          {mentor.approved ? "تایید شده در" : "برداشته شده در"} {decidedAt}
        </span>
      )}
    </div>
  );
}

function Section({ title, hint, mentors }: { title: string; hint: string; mentors: MentorAccount[] }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-body font-bold text-foreground">
          {title} ({toPersianDigits(mentors.length)})
        </h2>
        <p className="mt-0.5 text-caption text-muted-foreground">{hint}</p>
      </div>
      {mentors.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface p-4 text-caption text-muted-foreground">فعلاً کسی اینجا نیست.</p>
      ) : (
        mentors.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)
      )}
    </section>
  );
}

/**
 * The approval queue for self-registered mentors. /mentor/portal/register is
 * open to anyone with the link — no invite, no SMS verification — so this
 * screen is the only thing deciding who students actually see. Nothing a
 * mentor does to their own profile can put them on the site; only the
 * "تایید و انتشار" button here can (see MentorAccount.approved).
 *
 * Same access pattern as every other /mentor/admin/* page: not linked from
 * anywhere public, gated by isAdminSession.
 */
export default async function AdminMentorsPage() {
  if (!(await isAdminSession())) redirect("/mentor/admin/login?next=/mentor/admin/mentors");

  const accounts = await getMentorAccounts();
  // Catalogue-linked accounts (see MentorAccount.catalogueId) are the
  // founder's own curated cards — they were never gated by this queue and
  // aren't listed through the portal merge at all, so showing them here
  // would just be a row with a button that does nothing.
  const selfRegistered = accounts.filter((account) => !account.catalogueId);

  const pending = selfRegistered.filter((m) => isMentorProfileComplete(m) && m.approved !== true);
  const live = selfRegistered.filter((m) => isMentorProfileComplete(m) && m.approved === true);
  const incomplete = selfRegistered.filter((m) => !isMentorProfileComplete(m));

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="text-h1 font-bold text-foreground">تایید منتورها</h1>
        <p className="mt-1 text-caption text-muted-foreground">
          هرکسی لینک ثبت‌نام رو داشته باشه می‌تونه اکانت بسازه و پروفایل پر کنه، ولی تا وقتی اینجا تاییدش نکنی هیچ دانش‌آموزی نمی‌بیندش.
        </p>
      </div>

      <Section title="منتظر تایید" hint="پروفایلشون کامله و آماده‌ی انتشاره — قبل از تایید، متن‌ها و ویسشون رو ببین." mentors={pending} />
      <Section title="روی سایت" hint="الان برای همه‌ی بازدیدکننده‌ها دیده می‌شن و قابل رزروند." mentors={live} />
      <Section title="ناقص" hint="هنوز پروفایلشون رو تموم نکردن — دکمه‌ی تایید تا اون موقع فعال نمی‌شه." mentors={incomplete} />
    </div>
  );
}
