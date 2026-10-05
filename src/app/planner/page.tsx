import type { Metadata } from "next";
import { StudentShell } from "@/components/layout/StudentShell";
import { PlannerFlow } from "@/features/planner/PlannerFlow";
import { SITE_URL, pageOpenGraph } from "@/lib/siteConfig";

const TITLE = "برنامه‌ساز رایگان کنکور — برنامه‌ی مطالعه‌ی شخصی‌سازی‌شده";
const DESCRIPTION = "چند سؤال کوتاه، یه برنامه‌ی مطالعه‌ی دیتامحور و رایگان تا روز کنکور.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/planner" },
  openGraph: pageOpenGraph({ path: "/planner", title: TITLE, description: DESCRIPTION }),
};

const plannerJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "برنامه‌ساز کنکور",
  description: DESCRIPTION,
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: "IR",
  isAccessibleForFree: true,
  url: `${SITE_URL}/planner`,
};

/** Free, public, no-login diagnostic tool — same StudentShell chrome as the rest of the app, but reachable without going through /student at all (see /about, /terms for the same top-level-public precedent). */
export default function PlannerPage() {
  return (
    <StudentShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(plannerJsonLd) }} />
      <PlannerFlow />
    </StudentShell>
  );
}
