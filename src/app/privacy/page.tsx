import { CompactHeader } from "@/components/layout/CompactHeader";

export const metadata = {
  title: "حریم خصوصی",
};

export default function PrivacyPage() {
  return (
    <>
      <CompactHeader title="حریم خصوصی" backHref="/student/home" />
      <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pb-10 pt-6 text-body leading-8 text-foreground">
        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۱. اطلاعاتی که جمع‌آوری می‌شود</h2>
          <p>
            برای ارائه‌ی خدمت، اطلاعاتی مانند شماره موبایل، نام، تصویر پروفایل (در صورت
            آپلود) و اطلاعات تحصیلی‌ای که خودتان وارد می‌کنید، ذخیره می‌شود.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۲. نحوه‌ی استفاده از اطلاعات</h2>
          <p>
            این اطلاعات صرفاً برای ارائه‌ی خدمات هم‌مسیر استفاده می‌شود: تطبیق شما با منتور
            مناسب، برقراری ارتباط برای جلسه‌ی مشاوره و پیگیری روند مشاوره.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۳. اشتراک‌گذاری اطلاعات</h2>
          <p>
            اطلاعات شما با اشخاص ثالث به اشتراک گذاشته نمی‌شود، مگر ارائه‌دهندگان زیرساختی
            که برای عملکرد سایت لازم‌اند (مانند سرویس پیامک برای ارسال کد تایید).
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۴. امنیت اطلاعات</h2>
          <p>
            تلاش می‌کنیم اطلاعات شما را با رعایت استانداردهای متعارف امنیتی نگهداری کنیم.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h3 font-bold text-foreground">۵. تماس برای سوالات حریم خصوصی</h2>
          <p>
            برای هر سوالی درباره‌ی نحوه‌ی استفاده از اطلاعاتتان، از طریق شماره{" "}
            <span dir="ltr">۰۹۹۲۰۲۰۹۰۱۰</span> یا تلگرام{" "}
            <span dir="ltr">@hammasirsite</span> با ما در تماس باشید.
          </p>
        </section>
      </div>
    </>
  );
}
