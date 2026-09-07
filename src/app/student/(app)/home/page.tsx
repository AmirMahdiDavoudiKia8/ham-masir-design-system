import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { HomeContent } from "@/features/sessions/components/HomeContent";
import type { ResolvedBooking } from "@/features/sessions/resolveBooking";
import { getMentors } from "@/lib/mentors";
import { getSessionStudent } from "@/lib/mentorPortal";
import { SITE_DESCRIPTION, SITE_NAME, pageOpenGraph } from "@/lib/siteConfig";

/**
 * "/" permanently redirects here (see app/page.tsx), so this page — not the
 * root — is the one search engines actually index as the site's front door.
 * It inherited the layout's generic brand-only title until now, which put
 * zero keywords in the single most weighted tag on the site.
 */
export const metadata: Metadata = {
  title: "مشاوره و برنامه‌ریزی کنکور با دانشجوهایی که این مسیر رو رفتن",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/student/home" },
  openGraph: pageOpenGraph({
    path: "/student/home",
    title: `${SITE_NAME} — مشاوره و برنامه‌ریزی کنکور`,
    description: SITE_DESCRIPTION,
  }),
};

/**
 * The «روال کار چجوریه؟» steps and the pay-after promise, restated as
 * structured data. These are the questions a student actually arrives with,
 * and the answers are the same words HomeContent renders — kept in sync by
 * hand, so if the on-page steps change, change these too (Google penalises
 * FAQ markup that doesn't match visible page content).
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "هزینه رو کی باید پرداخت کنم؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "برای رزرو جلسه هیچ پولی گرفته نمی‌شه. اول جلسه برگزار می‌شه، بعدش اگه راضی بودی حساب می‌کنی. اگه راضی نبودی، هیچی بدهکار نیستی و ارائه‌ی دلیل هم لازم نیست.",
      },
    },
    {
      "@type": "Question",
      name: "هم‌مسیرها کی هستن؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "دانشجوهایی که خودشون یک‌دو سال پیش کنکور دادن و حالا در بهترین دانشگاه‌های کشور درس می‌خونن. هویت و سوابق تحصیلی هر هم‌مسیر پیش از پذیرش بررسی و تایید می‌شه.",
      },
    },
    {
      "@type": "Question",
      name: "طرح‌ها چیه و چه فرقی دارن؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "طرح راه‌نما: یک جلسه‌ی ۴۵ دقیقه‌ای در گوگل‌میت برای هر سؤالی درباره‌ی منابع، برنامه یا انتخاب رشته. طرح بادیگارد: ۴ جلسه‌ی ۴۵ دقیقه‌ای در ماه به‌همراه برنامه‌ریزی شخصی‌سازی‌شده و پیگیری مستمر پیشرفت.",
      },
    },
    {
      "@type": "Question",
      name: "چطور هم‌مسیرم رو انتخاب کنم؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "با پاسخ دادن به چند سؤال کوتاه و چهارگزینه‌ای، لیستی از هم‌مسیرهایی که تجربه‌ی مشابهی با تو داشتن رو می‌بینی و خودت از بینشون انتخاب می‌کنی.",
      },
    },
    {
      "@type": "Question",
      name: "جلسه‌ها کجا برگزار می‌شه؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "جلسه‌ها آنلاین و در گوگل‌میت برگزار می‌شن. بعد از ثبت رزرو، برای هماهنگی تایم دقیق باهات تماس گرفته می‌شه.",
      },
    },
  ],
};

export default async function HomePage() {
  const [mentors, sessionStudent] = await Promise.all([getMentors(), getSessionStudent()]);

  // A subscription made on another device (or restored after this browser's
  // storage was cleared) has no entry in the local bookingsStore — this is
  // the server-authoritative fallback so it still renders here. See
  // PortalStudent.mentorId's doc comment in lib/mentorPortal.ts.
  const serverMentor = sessionStudent?.mentorId ? mentors.find((m) => m.id === sessionStudent.mentorId) : undefined;
  const serverSession: ResolvedBooking | undefined = serverMentor
    ? {
        id: "server-session",
        mentorId: serverMentor.id,
        mentorName: serverMentor.name,
        mentorField: [serverMentor.field, serverMentor.university].filter(Boolean).join("، "),
        mentorPhoto: serverMentor.photo,
        plan: "subscription",
        planTitle: "طرح بادیگارد",
        status: "upcoming",
      }
    : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Header />
      <HomeContent
        mentors={mentors}
        meetLink={sessionStudent?.meetLink}
        cancelled={sessionStudent?.cancelled}
        serverSession={serverSession}
      />
    </>
  );
}
