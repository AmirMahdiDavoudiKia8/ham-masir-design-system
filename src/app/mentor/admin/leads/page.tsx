import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/adminAuth";
import { CsvDownloadButton } from "@/features/adminLeads/CsvDownloadButton";
import { EnablePushButton } from "@/features/adminLeads/EnablePushButton";
import { toPersianDigits } from "@/lib/format";
import { getLeads } from "@/lib/leads";
import { LEAD_TYPE_LABEL, type LeadType } from "@/lib/leadTypes";

// Reads live off-disk data on every request — must never be statically
// prerendered, same reasoning as every other /mentor/admin/* page.
export const dynamic = "force-dynamic";

// Its own manifest (scope /mentor/admin/) so the leads page can be added to an
// iPhone's Home Screen as an app — the only way iOS allows web push. Scoped
// here rather than site-wide so students' "add to home screen" is unaffected.
export const metadata: Metadata = {
  manifest: "/mentor/admin/manifest.webmanifest",
  robots: { index: false, follow: false },
};

const TYPE_LABELS = LEAD_TYPE_LABEL;

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

interface LeadsPageProps {
  searchParams: Promise<{ type?: string }>;
}

/**
 * Internal-only replacement for the Google Sheet lead log (see lib/leads.ts
 * for why) — same access pattern as the other /mentor/admin/* pages: not
 * linked from anywhere public, gated by isAdminSession. Every lead this app
 * records (quiz answers, registrations, bookings, cancellations, mentor
 * signups/requests) shows up here the instant it happens, straight from
 * this app's own persistent storage — no external service that can silently
 * stop working.
 */
export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  if (!(await isAdminSession())) redirect("/mentor/admin/login?next=/mentor/admin/leads");

  const { type: typeFilter } = await searchParams;
  const leads = await getLeads();
  const filtered = typeFilter ? leads.filter((l) => l.type === typeFilter) : leads;

  const counts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.type] = (acc[l.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-h1 font-bold text-foreground">لیدها</h1>
          <p className="mt-1 text-caption text-muted-foreground">
            این صفحه فقط داخلیه، جایی لینک نشده. کل {toPersianDigits(leads.length)} مورد.
          </p>
        </div>
        <CsvDownloadButton leads={filtered} />
      </div>

      <EnablePushButton vapidPublicKey={process.env.VAPID_PUBLIC_KEY} />

      <div className="flex flex-wrap gap-2">
        <Link
          href="/mentor/admin/leads"
          className={`rounded-full px-3 py-1.5 text-label font-semibold ${
            !typeFilter ? "bg-primary text-white" : "bg-surface-alt text-muted-foreground"
          }`}
        >
          همه ({toPersianDigits(leads.length)})
        </Link>
        {(Object.keys(TYPE_LABELS) as LeadType[])
          .filter((t) => counts[t] > 0)
          .map((t) => (
            <Link
              key={t}
              href={`/mentor/admin/leads?type=${t}`}
              className={`rounded-full px-3 py-1.5 text-label font-semibold ${
                typeFilter === t ? "bg-primary text-white" : "bg-surface-alt text-muted-foreground"
              }`}
            >
              {TYPE_LABELS[t]} ({toPersianDigits(counts[t])})
            </Link>
          ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface p-4 text-caption text-muted-foreground">
          هنوز هیچ لیدی ثبت نشده.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((lead, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-label font-bold text-primary">
                  {TYPE_LABELS[lead.type] ?? lead.type}
                </span>
                <span className="text-label text-muted-foreground">{formatDate(lead.at)}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
                {Object.entries(lead.data)
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <span key={k}>
                      <span className="text-muted-foreground/70">{k}:</span> {v}
                    </span>
                  ))}
              </div>
              {lead.data.phone && (
                <Link
                  href={`/mentor/admin/students?phone=${encodeURIComponent(lead.data.phone)}`}
                  className="self-start text-label font-semibold text-primary underline-offset-2 hover:underline"
                >
                  مسیر کامل این شماره رو ببین
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
