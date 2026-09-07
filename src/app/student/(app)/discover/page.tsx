import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { DiscoveryForm } from "@/features/discovery/components/DiscoveryForm";
import { getMentors } from "@/lib/mentors";
import { pageOpenGraph } from "@/lib/siteConfig";

const TITLE = "لیست مشاوران و منتورهای کنکور";
const DESCRIPTION =
  "بین دانشجوهای دانشگاه‌های برتر کشور بگرد و هم‌مسیرت رو انتخاب کن. قیمت همه یکسانه و پرداخت بعد از جلسه‌ست — فقط اگه راضی بودی.";

/** The real, server-rendered mentor list (/student/mentors is only a redirect here) — so this is the page that carries the internal links into all 19 profiles. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/student/discover" },
  openGraph: pageOpenGraph({ path: "/student/discover", title: TITLE, description: DESCRIPTION }),
};

// Without this, Next treats the whole page as statically prerendered
// because of the unstable_cache call inside getMentors (see lib/mentors.ts)
// — so a mentor finishing their portal profile doesn't show up here until
// this page's own hour-long cache happens to regenerate, no matter how many
// times revalidatePath("/student", "layout") fires from the profile-save
// actions. Forcing dynamic rendering makes a completed profile appear the
// moment the next student loads this page. The catalogue JSON read still
// benefits from its own separate 1-hour cache inside getCachedCatalogueMentors.
export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const mentors = await getMentors();

  return (
    <>
      <Header />
      <div className="flex flex-col gap-7 px-4 pb-2 pt-6">
        <div className="animate-rise-in flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
          <h1 className="text-h3 font-bold text-foreground">سه پیشنهاد برای انتخاب هم‌مسیر:</h1>
          <ol className="flex flex-col gap-2.5">
            <li className="flex items-start gap-2.5 text-caption text-muted-foreground">
              <span className="mt-0.5 shrink-0 font-bold text-primary">۱.</span>
              همه‌ی هم‌مسیرها قیمت یکسانی دارن و همه هم بعد از جلسه حساب می‌شن — پس به‌جای رتبه، بر اساس هدف و ساعتی که برای مطالعه داری، انتخاب کن.
            </li>
            <li className="flex items-start gap-2.5 text-caption text-muted-foreground">
              <span className="mt-0.5 shrink-0 font-bold text-primary">۲.</span>
              پیشنهاد ما اینه که قبل از انتخاب طرح بادیگارد، اول یه طرح راه‌نما (یک جلسه‌ی ۴۵ دقیقه‌ای) با هم‌مسیر موردنظرت بگذرونی — تا ببینی واقعاً همدیگه رو درک می‌کنین یا نه.
            </li>
            <li className="flex items-start gap-2.5 text-caption text-muted-foreground">
              <span className="mt-0.5 shrink-0 font-bold text-primary">۳.</span>
              با انتخاب طرح بادیگارد، سیستم برنامه‌ریزی آنلاین برات باز می‌شه و می‌تونی درس‌خوندنت رو مستقیم داخل سایت هم‌مسیر پیگیری کنی.
            </li>
          </ol>
        </div>

        <Suspense fallback={null}>
          <DiscoveryForm mentors={mentors} />
        </Suspense>
      </div>
    </>
  );
}
