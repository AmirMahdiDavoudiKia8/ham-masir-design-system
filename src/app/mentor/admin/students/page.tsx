import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/adminAuth";
import { Input } from "@/components/ui/Input";
import { toPersianDigits } from "@/lib/format";
import { LEAD_TYPE_LABEL } from "@/lib/sheetForward";
import { getConversionBySource, getMultiTouchPhones, getStudentJourney } from "@/lib/studentJourney";

// Reads live off-disk data on every request — same reasoning as every other
// /mentor/admin/* page.
export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = { lead: "لید", booking: "رزرو", payment: "پرداخت" };
const KIND_CLASS: Record<string, string> = {
  lead: "bg-primary-soft text-primary",
  booking: "bg-secondary-soft text-secondary-dark",
  payment: "bg-surface-alt text-foreground",
};

function formatDate(iso: string): string {
  const formatted = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
  return toPersianDigits(formatted);
}

function pct(part: number, whole: number): string {
  if (whole === 0) return "—";
  return `${toPersianDigits(Math.round((part / whole) * 1000) / 10)}٪`;
}

interface StudentsPageProps {
  searchParams: Promise<{ phone?: string }>;
}

/**
 * Joins the three data sources that only ever get checked one at a time
 * (leads.json, studentBookings.json, paymentRequests.json) by phone number —
 * answers "این شماره از کجا اومد و آخرش پول داد یا نه؟", which nothing else
 * in the admin surface computes. Same access pattern as the other
 * /mentor/admin/* pages: not linked publicly, gated by isAdminSession.
 */
export default async function AdminStudentsPage({ searchParams }: StudentsPageProps) {
  if (!(await isAdminSession())) redirect("/mentor/admin/login?next=/mentor/admin/students");

  const { phone } = await searchParams;
  const [conversions, multiTouch] = await Promise.all([getConversionBySource(), getMultiTouchPhones()]);
  const journey = phone ? await getStudentJourney(phone) : null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-h1 font-bold text-foreground">مسیر دانش‌آموزها</h1>
        <p className="mt-1 text-caption text-muted-foreground">این صفحه فقط داخلیه، جایی لینک نشده.</p>
      </div>

      <form className="flex gap-2">
        <Input
          type="tel"
          name="phone"
          defaultValue={phone ?? ""}
          placeholder="شماره تلفن رو وارد کن"
          dir="ltr"
          className="text-left"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-primary px-4 text-caption font-bold text-white transition-colors duration-standard ease-gentle hover:bg-primary-hover"
        >
          جست‌وجو
        </button>
      </form>

      {journey && (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
          <h2 className="text-body font-bold text-foreground" dir="ltr">
            {journey.phone}
          </h2>
          {journey.events.length === 0 ? (
            <p className="text-caption text-muted-foreground">هیچ ردی از این شماره پیدا نشد.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {journey.events.map((event, i) => (
                <div key={i} className="flex flex-col gap-1 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-label font-bold ${KIND_CLASS[event.kind]}`}>
                      {KIND_LABEL[event.kind]} · {event.label}
                    </span>
                    <span className="shrink-0 text-label text-muted-foreground">{formatDate(event.at)}</span>
                  </div>
                  {event.detail && <p className="text-caption text-muted-foreground">{event.detail}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
        <h2 className="text-body font-bold text-foreground">تبدیل به پرداخت، به تفکیک کانال ورودی</h2>
        {conversions.length === 0 ? (
          <p className="py-2 text-caption text-muted-foreground">هنوز داده‌ای نیست.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {conversions.map((c) => (
              <div key={c.type} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-caption text-foreground">{LEAD_TYPE_LABEL[c.type] ?? c.type}</span>
                <span className="shrink-0 text-caption font-bold text-primary">
                  {toPersianDigits(c.paidCount)} / {toPersianDigits(c.leadCount)} ({pct(c.paidCount, c.leadCount)})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
        <h2 className="text-body font-bold text-foreground">شماره‌هایی که از چند ابزار سر زدن</h2>
        {multiTouch.length === 0 ? (
          <p className="py-2 text-caption text-muted-foreground">هنوز کسی از چند ابزار استفاده نکرده.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {multiTouch.map((m) => (
              <Link
                key={m.phone}
                href={`/mentor/admin/students?phone=${encodeURIComponent(m.phone)}`}
                className="flex items-center justify-between gap-3 py-2.5 hover:opacity-80"
              >
                <span dir="ltr" className="text-caption text-foreground">
                  {m.phone}
                </span>
                <span className="shrink-0 text-label text-muted-foreground">
                  {m.types.map((t) => LEAD_TYPE_LABEL[t] ?? t).join("، ")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
