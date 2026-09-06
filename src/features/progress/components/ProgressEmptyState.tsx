import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressIcon } from "@/components/ui/icons";

/** Shown when the student has no active monthly subscription — a weekly plan only exists once one does, so this is an invitation forward, not a broken screen. */
export function ProgressEmptyState() {
  return (
    <EmptyState
      icon={<ProgressIcon className="h-6 w-6" />}
      title="هنوز برنامه‌ای برات چیده نشده"
      description="برنامه و پیگیریِ هفتگی، بخشی از اشتراک ماهانه با یه هم‌مسیره، یکی رو انتخاب کن تا از همین‌جا شروع کنیم."
      action={
        <Link href="/student/discover" className={buttonClasses("primary", "md", false, "mt-1")}>
          پیدا کردن هم‌مسیر
        </Link>
      }
    />
  );
}
