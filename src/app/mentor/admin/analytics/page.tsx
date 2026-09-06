import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/adminAuth";
import { getAnalyticsSummary, hasAnyAnalyticsData } from "@/lib/analytics";
import { toPersianDigits } from "@/lib/format";

// Reads live off-disk data on every request — without this, Next prerenders
// this route once at build time and would keep serving that frozen
// snapshot forever, since nothing here reads cookies/searchParams to force
// dynamic rendering on its own.
export const dynamic = "force-dynamic";

const LABEL_NAMES: Record<string, string> = {
  mentor_card: "کلیک روی کارت منتور",
  payment_submit: "کلیک روی «پرداخت»",
  mentor_request_open: "باز کردن فرم «هم‌مسیر دلخواه»",
  mentor_request_submit: "ارسال فرم «هم‌مسیر دلخواه»",
};

function pct(part: number, whole: number): string {
  if (whole === 0) return "—";
  return `${toPersianDigits(Math.round((part / whole) * 1000) / 10)}٪`;
}

/**
 * Internal-only MVP tool, same pattern as /mentor/admin/plan — not linked
 * from anywhere, gated by isAdminSession (see lib/adminAuth.ts). Self-hosted
 * in place of Google Analytics since GA's collector is unreliably filtered
 * for a meaningful share of visitors in Iran (see lib/analytics.ts).
 */
export default async function AnalyticsAdminPage() {
  if (!(await isAdminSession())) redirect("/mentor/admin/login?next=/mentor/admin/analytics");

  const [summary30, summary7, hasData] = await Promise.all([
    getAnalyticsSummary(30),
    getAnalyticsSummary(7),
    hasAnyAnalyticsData(),
  ]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-h1 font-bold text-foreground">آمار سایت</h1>
        <p className="mt-1 text-caption text-muted-foreground">این صفحه فقط داخلیه، جایی لینک نشده.</p>
      </div>

      {!hasData && (
        <p className="rounded-lg border border-border bg-surface p-4 text-caption text-muted-foreground">
          هنوز داده‌ای ثبت نشده — همین که یکی سایت رو باز کنه، اینجا پر می‌شه.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="بازدید صفحه (۷ روز اخیر)" value={summary7.totalPageviews} />
        <StatCard label="بازدیدکننده‌ی یکتا (۷ روز اخیر)" value={summary7.uniqueVisitors} />
        <StatCard label="بازدید صفحه (۳۰ روز اخیر)" value={summary30.totalPageviews} />
        <StatCard label="بازدیدکننده‌ی یکتا (۳۰ روز اخیر)" value={summary30.uniqueVisitors} />
      </div>

      <Section title="نرخ کلیک (۳۰ روز اخیر)">
        <div className="flex flex-col divide-y divide-border">
          <FunnelRow
            label="از لیست منتورها رفتن سراغ یه پروفایل"
            part={summary30.funnels.mentorCardClicks}
            whole={summary30.funnels.mentorListViews}
          />
          <FunnelRow
            label="از صفحه‌ی پرداخت زدن «پرداخت»"
            part={summary30.funnels.paymentSubmitClicks}
            whole={summary30.funnels.paymentPageViews}
          />
        </div>
      </Section>

      <Section title="پربازدیدترین صفحه‌ها (۳۰ روز اخیر)">
        {summary30.topPaths.length === 0 ? (
          <EmptyRow />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {summary30.topPaths.map((p) => (
              <div key={p.path} className="flex items-center justify-between gap-3 py-2.5">
                <span dir="ltr" className="truncate text-caption text-foreground">
                  {p.path}
                </span>
                <span className="shrink-0 text-caption font-bold text-primary">{toPersianDigits(p.count)}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="کلیک‌های ثبت‌شده (۳۰ روز اخیر)">
        {summary30.clicksByLabel.length === 0 ? (
          <EmptyRow />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {summary30.clicksByLabel.map((c) => (
              <div key={c.label} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-caption text-foreground">{LABEL_NAMES[c.label] ?? c.label}</span>
                <span className="shrink-0 text-caption font-bold text-primary">{toPersianDigits(c.count)}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="روزانه (۱۴ روز اخیر)">
        <div className="flex flex-col divide-y divide-border">
          {summary30.byDay.slice(0, 14).map((d) => (
            <div key={d.date} className="flex items-center justify-between gap-3 py-2.5">
              <span dir="ltr" className="text-caption text-muted-foreground">
                {d.date}
              </span>
              <span className="text-caption text-foreground">
                {toPersianDigits(d.pageviews)} بازدید · {toPersianDigits(d.uniqueVisitors)} یکتا
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4">
      <span className="text-caption text-muted-foreground">{label}</span>
      <span className="text-h2 font-bold text-foreground">{toPersianDigits(value)}</span>
    </div>
  );
}

function FunnelRow({ label, part, whole }: { label: string; part: number; whole: number }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-caption text-foreground">{label}</span>
      <span className="shrink-0 text-caption font-bold text-primary">
        {toPersianDigits(part)} / {toPersianDigits(whole)} ({pct(part, whole)})
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
      <h2 className="text-body font-bold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

function EmptyRow() {
  return <p className="py-2 text-caption text-muted-foreground">داده‌ای نیست.</p>;
}
