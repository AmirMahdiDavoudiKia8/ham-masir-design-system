import { CompactHeader } from "@/components/layout/CompactHeader";
import { SITE_CONTACTS } from "@/lib/siteLinks";

export const metadata = {
  title: "درباره ما",
};

export default function AboutPage() {
  return (
    <>
      <CompactHeader title="درباره ما" backHref="/student/home" />
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pb-10 pt-6">
        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">هم‌مسیر چی هست اصلا؟</h2>
          <p className="text-body leading-8 text-foreground">
            تاحالا شده توی مسیر سخت و مبهم کنکور، حس تنهایی بهت دست بده؟ به خودت شک کنی و
            ندونی کدوم راه درسته کدوم راه غلط؟ هم‌مسیر برای همین ساخته شده. اینجا می‌تونی با
            نسخه‌ای از خودت که دو سه سال زودتر کنکور داده و الان توی رشته و دانشگاه
            موردعلاقه‌ت دانشجوئه دوست شی، سوالات رو ازش بپرسی و توی این مسیر تنها نباشی.
            اینجا کسی رو پیدا می‌کنی که جواب سوالای توی ذهنت رو داره، درکت می‌کنه و تا تهش
            باهاته.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">هم‌مسیر رو کی ساخته؟</h2>
          <p className="text-body leading-8 text-foreground">
            هم‌مسیر رو یه دانشجو ساخته، نه یه مؤسسه‌ی بزرگ با بودجه چند میلیاردی. کسی که خودش
            دیده کنکور فقط درس‌خوندن نیست؛ یه بخشیش هم تنهاییه، همون لحظه‌هایی که نمی‌دونی حرف
            کی رو باور کنی و هیچ‌کس متوجهِ سنگینی بار روی شونه‌هات نمی‌شه.
            <br />
            اسم من امیرمهدی داودی‌کیاست و همین الان که داری این متنو می‌خونی، احتمالاً بین
            درس‌خوندن و کدنویسی این سایت گیر کردم :)
          </p>
          <p className="text-body leading-8 text-foreground">
            اگه سؤال، انتقاد یا پیشنهادی داشتی، یا فقط خواستی یه سلام علیکی داشته باشیم، جای
            دوری نیستم؛ چون کنکور دو نفری آسون‌تره، حتی وقتی اون یه نفر، سازنده‌ی خود سایته.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-bold text-foreground">راه‌های تماس</h2>
          {SITE_CONTACTS.map(({ key, label, detail, href, Icon }) => (
            <a
              key={key}
              href={href}
              target={key === "phone" ? undefined : "_blank"}
              rel={key === "phone" ? undefined : "noopener noreferrer"}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-card transition-all duration-standard ease-gentle active:scale-[0.98] hover:border-primary-light"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-body font-bold text-foreground">{label}</span>
                <span dir="ltr" className="text-caption text-muted-foreground">
                  {detail}
                </span>
              </span>
            </a>
          ))}
        </section>
      </div>
    </>
  );
}
