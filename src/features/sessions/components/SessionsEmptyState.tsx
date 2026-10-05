import Link from "next/link";
import { buttonClasses } from "@/design-system";
import { EmptyState } from "@/design-system";
import { AccompaniedLineIcon } from "@/design-system";

/** brand.md §7: an invitation, not a void — never blame the student for having nothing here yet. */
export function SessionsEmptyState() {
  return (
    <EmptyState
      icon={<AccompaniedLineIcon className="h-7 w-7" />}
      title="هنوز هم‌مسیری انتخاب نکردی"
      description="مسیرت رو تنها نرو — بیا با هم پیداش کنیم، چند تا فیلتر ساده کافیه تا بهترین هم‌مسیر رو بهت نشون بدیم."
      action={
        <Link href="/student/discover" className={buttonClasses("primary", "md", false, "mt-1")}>
          پیدا کردن هم‌مسیر
        </Link>
      }
    />
  );
}
