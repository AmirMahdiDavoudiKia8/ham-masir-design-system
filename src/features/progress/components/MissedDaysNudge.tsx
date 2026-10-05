import { SparkleIcon } from "@/design-system";

/** brand.md §7: warm, non-judgmental, forward-looking — never "چرا عقب افتادی؟" */
export function MissedDaysNudge() {
  return (
    <div className="flex items-start gap-2.5 rounded-md bg-alert-soft px-4 py-3.5">
      <SparkleIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-alert" />
      <p className="text-caption text-alert-foreground">هر روز یه شروعِ تازه‌ست. بیا از همین‌جا ادامه بدیم.</p>
    </div>
  );
}
