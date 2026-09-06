import { CompactHeader } from "@/components/layout/CompactHeader";

export const metadata = {
  title: "قوانین و مقررات | هم‌مسیر",
};

export default function TermsPage() {
  return (
    <>
      <CompactHeader title="قوانین و مقررات" backHref="/student/home" />
      <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pb-10 pt-6 text-body leading-8 text-foreground">
        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۱. ماهیت خدمات</h2>
          <p>
            هم‌مسیر پلتفرمی است برای اتصال دانش‌آموزان کنکوری به دانشجویانی (هم‌مسیر) که
            پیش‌تر همین مسیر را طی کرده‌اند. خدمات ارائه‌شده بر پایه‌ی انتقال تجربه‌ی شخصی
            هم‌مسیرهاست و مشاوره‌ی تخصصی تحصیلی یا روان‌شناختی محسوب نمی‌شود. استفاده از
            خدمات هم‌مسیر، هیچ نتیجه‌ی خاصی (قبولی، رتبه، یا بهبود عملکرد تحصیلی) را تضمین
            نمی‌کند.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۲. طرح‌های ارائه‌شده</h2>
          <ul className="list-inside list-disc">
            <li>طرح راه‌نما: یک جلسه‌ی ۴۵ دقیقه‌ای آنلاین (گوگل‌میت).</li>
            <li>
              طرح بادیگارد: ۴ جلسه‌ی ۴۵ دقیقه‌ای در ماه، به‌همراه دسترسی به سیستم برنامه‌ریزی
              آنلاین و پیگیری پیشرفت.
            </li>
          </ul>
          <p>
            قیمت این طرح‌ها برای تمامی هم‌مسیرها یکسان است و بر اساس رتبه یا دانشگاه هم‌مسیر
            متفاوت نمی‌شود.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۳. رزرو و پرداخت</h2>
          <p>
            رزرو جلسه پس از انتخاب هم‌مسیر و پرداخت آنلاین از طریق درگاه رسمی (زرین‌پال)
            نهایی می‌شود. تأیید رزرو بلافاصله پس از پرداخت برای کاربر نمایش داده می‌شود.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۴. انصراف و لغو جلسه</h2>
          <p>
            <span className="font-bold">از طرف دانش‌آموز:</span> امکان لغو جلسه همیشه وجود
            دارد. در صورت لغو با فاصله‌ی کمتر از یک ساعت به زمان جلسه، ۷۰٪ مبلغ پرداختی
            بازگردانده می‌شود.
          </p>
          <p>
            <span className="font-bold">از طرف هم‌مسیر:</span> هم‌مسیر می‌تواند تا ۶ ساعت
            پیش از جلسه، با ذکر دلیل، جلسه را لغو کند. لغوهای مکرر با فاصله‌ی کمتر از ۶ ساعت
            منجر به اخطار جدی می‌شود؛ در صورتی که دلیل ارائه‌شده منطقی تشخیص داده نشود،
            همکاری با آن هم‌مسیر قطع خواهد شد.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۵. تضمین رضایت</h2>
          <p>
            در صورت نارضایتی از کیفیت یک جلسه، کاربر می‌تواند موضوع را با تیم هم‌مسیر در میان
            بگذارد. پس از بررسی، در صورت تأیید، یک جلسه‌ی جبرانی رایگان به کاربر تعلق می‌گیرد.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۶. تأیید و نظارت بر هم‌مسیرها</h2>
          <p>
            پیش از پذیرش، هویت و سوابق تحصیلی هر هم‌مسیر بررسی و تأیید می‌شود. عملکرد
            هم‌مسیرها پس از شروع همکاری نیز به‌طور مستمر رصد می‌شود؛ در صورت افت کیفیت یا
            دریافت شکایات مکرر، همکاری با آن هم‌مسیر می‌تواند قطع شود.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۷. مسئولیت محتوا</h2>
          <p>
            محتوای ارائه‌شده در جلسات، برداشت و تجربه‌ی شخصی هر هم‌مسیر است. پلتفرم هم‌مسیر
            بر صحت تک‌تک جملات مطرح‌شده در جلسات نظارت مستقیم و لحظه‌به‌لحظه ندارد و مسئولیت
            تصمیمات نهایی تحصیلی بر عهده‌ی خود کاربر است.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۸. حریم خصوصی و داده‌ها</h2>
          <p>
            اطلاعات شخصی کاربران صرفاً برای ارائه‌ی خدمات پلتفرم استفاده می‌شود و به شکل
            مستقیم به اشخاص یا نهادهای ثالث فروخته نمی‌شود. داده‌های آماری و ناشناس (بدون
            امکان شناسایی فرد) ممکن است در آینده برای بهبود منابع و محتوای آموزشی، با نهادهای
            آموزشی به اشتراک گذاشته شود.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۹. کاربران زیر ۱۸ سال</h2>
          <p>
            در صورتی که کاربر زیر ۱۸ سال سن داشته باشد، پذیرش این قوانین و مسئولیت استفاده از
            خدمات بر عهده‌ی والد یا سرپرست قانونی اوست.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۱۰. تغییرات قوانین</h2>
          <p>
            هم‌مسیر می‌تواند این قوانین را در آینده به‌روزرسانی کند. تغییرات مهم از طریق سایت
            به اطلاع کاربران خواهد رسید.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۱۱. ارتباط با ما</h2>
          <p>
            برای هرگونه سؤال، شکایت یا پیشنهاد، می‌توانید از طریق تلگرام{" "}
            <span dir="ltr">@hammasirsite</span> یا شماره{" "}
            <span dir="ltr">۰۹۹۲۰۲۰۹۰۱۰</span> با تیم هم‌مسیر در تماس باشید.
          </p>
        </section>
      </div>
    </>
  );
}
