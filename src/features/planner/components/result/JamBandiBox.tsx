/** Section G — shown only when daysLeft < 30 (ResultPage gates this), explaining the "سه‌روزه" review-only routine, warm and supportive rather than alarming. */
export function JamBandiBox() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-secondary/40 bg-secondary-soft p-5">
      <h3 className="text-h3 font-bold text-secondary-foreground">روش سه‌روزه</h3>
      <p className="text-body leading-7 text-secondary-foreground">
        هر ۳ روز یک‌بار، یک آزمون کامل شبیه‌سازی‌شده حل کن و تحلیلش کن. الان مطلب جدید یاد نگیر — فقط مرور کن و تست بزن.
      </p>
    </div>
  );
}
