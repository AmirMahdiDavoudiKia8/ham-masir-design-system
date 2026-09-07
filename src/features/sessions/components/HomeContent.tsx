"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowLeftIcon, UsersIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PayAfterPromise } from "@/components/brand/PayAfterPromise";
import { MentorStripCard } from "@/features/mentors/components/MentorStripCard";
import type { CancellationInfo } from "@/lib/mentorPortal";
import type { Mentor } from "@/lib/mentors";
import { toPersianDigits } from "@/lib/format";
import { useBookingsStore } from "@/store/bookingsStore";
import type { ResolvedBooking } from "../resolveBooking";
import { SessionsHome } from "./SessionsHome";

const howItWorks = [
  {
    title: "مناسب‌ترین هم‌مسیرت رو پیدا کن",
    text: "با پاسخ‌دادن به چند سؤال کوتاه و چهارگزینه‌ای، لیستی از هم‌مسیرهایی که تجربه‌ی مشابهی با تو داشتن رو می‌بینی — و خودت از بینشون انتخاب می‌کنی.",
  },
  {
    title: "طرحی که بهت می‌خوره رو انتخاب کن",
    text: (
      <>
        بعد از انتخاب هم‌مسیرت، بین دو طرح یکی رو انتخاب می‌کنی: <strong className="font-semibold">راه‌نما</strong> (یک
        جلسه‌ی ۴۵ دقیقه‌ای در گوگل‌میت) یا <strong className="font-semibold">بادیگارد</strong> (۴ جلسه‌ی ۴۵ دقیقه‌ای در
        ماه + برنامه‌ریزی آنلاین + گزارش‌دهی).
      </>
    ),
  },
  {
    title: "جلسه رو رزرو کن — بدون هیچ پرداختی",
    text: "زمانی که برات مناسبه رو انتخاب می‌کنی و رزروت ثبت می‌شه. همین. نه درگاهی، نه کارت به کارتی — ما برای هماهنگی تایم دقیق باهات تماس می‌گیریم.",
  },
  {
    title: "برنامه‌ات رو دنبال کن",
    text: 'با انتخاب طرح بادیگارد، بخش "پیشرفت" برات باز می‌شه و می‌تونی طبق برنامه‌ای که هم‌مسیرت برات نوشته، مستقیم داخل سایت هم‌مسیر پیش بری.',
  },
  {
    title: "اول جلسه، بعد پرداخت",
    text: "تهش خودت تصمیم می‌گیری. اگه جلسه به کارت اومد، حساب می‌کنی؛ اگه راضی نبودی، هیچی بدهکار نیستی و کسی هم ازت دلیل نمی‌خواد.",
  },
];

interface HomeContentProps {
  mentors: Mentor[];
  meetLink?: string;
  cancelled?: CancellationInfo;
  /** The real subscription relationship built server-side (see SessionsHome's own doc comment) — present even when this browser's local bookingsStore has never heard of it. */
  serverSession?: ResolvedBooking;
}

/**
 * The "خانه" tab branches on whether the student has any session to show:
 * either this browser's local bookingsStore has one, or the server-side
 * session (a subscription made on another device) does. `useBookingsStore`
 * only hydrates client-side, so this whole decision has to live in a client
 * component — `mentors`/`meetLink`/`serverSession` are fetched server-side
 * by the page and handed down as props either way.
 */
export function HomeContent({ mentors, meetLink, cancelled, serverSession }: HomeContentProps) {
  const bookings = useBookingsStore((s) => s.bookings);

  if (bookings.length > 0 || serverSession) {
    return (
      <div className="flex flex-col px-4 pb-10 pt-6">
        <SessionsHome mentors={mentors} meetLink={meetLink} cancelled={cancelled} serverSession={serverSession} />
        <SiteFooter />
      </div>
    );
  }

  const featured = mentors.slice(0, 10);

  return (
    <div className="flex flex-col gap-8 px-4 pb-10 pt-6">
      <div className="flex flex-col items-start gap-3 animate-rise-in">
        <h1 className="text-display font-bold text-foreground">اینجا چه خبره؟</h1>
        <p className="text-body leading-[1.7] text-right text-muted-foreground">
          اینجا می‌تونی از بین دانشجوهایی که یک روز دقیقاً جای تو بودن و
          حالا در بهترین دانشگاه‌های کشور درس می‌خونن، یک نفر رو به عنوان{" "}
          <span className="font-bold text-secondary-dark">هم‌مسیر</span> انتخاب کنی و توی مسیر سخت و مبهم کنکور یک چراغ راهنما و یک
          هم‌سفر راه‌بلد داشته باشی. چون کنکور دو نفری آسون‌تره.
        </p>
      </div>

      <div className="flex animate-rise-in justify-center">
        <Link href="/student/discover" className={buttonClasses("primary", "md", false, undefined, true)}>
          بیا هم‌مسیرتو پیدا کن
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>
      </div>

      <PayAfterPromise className="animate-rise-in" />

      <div
        className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-gradient-to-b from-primary-soft to-surface p-5 text-center shadow-card animate-rise-in"
        style={{ animationDelay: "40ms" }}
      >
        <h2 className="text-h3 font-bold text-foreground">نمی‌دونی باید چقدر وقت رو هر درس بذاری؟</h2>
        <p className="text-caption text-muted-foreground">با چند سؤال کوتاه و کاملاً رایگان، یه برنامه‌ی مطالعه‌ی دیتامحور بساز.</p>
        <Link href="/planner" className={buttonClasses("outline-brand", "md", false, undefined, true)}>
          برنامه‌ساز کنکور رو امتحان کن
        </Link>
      </div>

      {featured.length > 0 && (
        <div className="flex flex-col gap-3 animate-rise-in" style={{ animationDelay: "80ms" }}>
          <h2 className="text-h3 font-bold text-foreground">هم‌مسیرهایی که می‌تونی انتخاب کنی</h2>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
            {featured.map((mentor) => (
              <MentorStripCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 animate-rise-in" style={{ animationDelay: "120ms" }}>
        <h2 className="text-center text-h2 font-bold text-foreground">روال کار چجوریه؟</h2>

        <div className="flex flex-col gap-3">
          {howItWorks.map(({ title, text }, i) => {
            // Last step ("تنها نمی‌مونی") is the reassurance/guarantee — given
            // the site's peach accent so it stands out from the rest, not just
            // another step in the sequence.
            const isHighlighted = i === howItWorks.length - 1;
            return (
              <div
                key={title}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 shadow-card",
                  isHighlighted ? "border-secondary bg-secondary-soft" : "border-border bg-surface",
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-body font-bold",
                    isHighlighted ? "bg-secondary text-secondary-foreground" : "bg-primary-soft text-primary",
                  )}
                >
                  {toPersianDigits(i + 1)}
                </span>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-body font-bold text-foreground">{title}</h3>
                  <p className="text-caption text-muted-foreground">{text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 animate-rise-in" style={{ animationDelay: "160ms" }}>
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-card">
          <h2 className="text-right text-h2 font-bold text-foreground">چرا هم‌مسیر؟</h2>
          <p className="text-body leading-[1.7] text-right text-muted-foreground">
            توی سال کنکور، سخت‌ترین بخش ماجرا لزوماً درس‌خوندن نیست. سخت‌ترین بخشش اینه که نمی‌دونی کاری که داری
            انجام می‌دی درسته یا نه.
          </p>
          <p className="text-body leading-[1.7] text-right text-muted-foreground">
            هزار تا حرف می‌شنوی؛ از دوستات، از معلما، از اینستاگرام، از یه ویدیوی انگیزشی که نصفه‌شب دیدی. هرکدوم یه
            چیز می‌گن و تو نمی‌دونی که کدوم درسته، و بدتر: کدوم برای تو درسته.
          </p>
          <p className="text-body leading-[1.7] text-right text-muted-foreground">
            همیشه دلم می‌خواست یه نفر باشه که بتونه خودشو بذاره جای من و منو از تموم تردیدها و سوالاتم نجات بده.
            درکم کنه و راه حل همه‌ی سوالا رو داشته باشه. کسی که ازش بپرسم: تو اگه جای من بودی چکار می‌کردی؟
          </p>
          <p className="text-body font-bold leading-[1.7] text-right text-foreground">هم‌مسیر برای همینه.</p>
          <p className="text-body leading-[1.7] text-right text-muted-foreground">
            اینجا یکی رو انتخاب می‌کنی که یکی‌دو سال پیش دقیقاً همین‌جا ایستاده بود؛ با همون تردیدها، همون شب‌های بد
            و همون سردرگمی‌ها. کسی که از دل یه جنگ بیرون اومده و حالا جنگیدن رو بهتر از هرکسی می‌تونه یادت بده.
          </p>
          <p className="text-body leading-[1.7] text-right text-muted-foreground">
            و مهم‌تر از همه: تصمیم آخر همیشه با خودته. هم‌مسیرت مسیرش رو نشونت می‌ده، ولی این تویی که راه خودتو
            انتخاب می‌کنی و می‌ری. ما فقط کاری می‌کنیم که تنها این مسیر رو طی نکنی.
          </p>
          <p className="text-center text-body font-bold text-secondary-dark">چون کنکور دو نفری آسون‌تره.</p>
        </div>
      </div>

      <SiteFooter />

      <div className="fixed inset-x-0 bottom-24 z-30 flex justify-center px-4">
        <a
          href="https://t.me/hammasirsite"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary-soft/95 px-5 py-3 text-caption font-bold text-secondary-foreground shadow-lifted backdrop-blur-md transition-all duration-standard ease-gentle active:scale-[0.98]"
        >
          <UsersIcon className="h-5 w-5" />
          دانشجو هستم و می‌خوام به تیم هم‌مسیر ملحق شم
        </a>
      </div>
    </div>
  );
}
