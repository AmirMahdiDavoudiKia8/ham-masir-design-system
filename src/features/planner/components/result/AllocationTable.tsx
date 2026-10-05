import { Card } from "@/design-system";
import { toPersianDigits } from "@/lib/format";
import { SELF_RATING_LABEL } from "../../constants";
import { explainAllocation } from "../../explanations";
import type { SubjectAllocation, SubjectInput } from "../../types";

interface AllocationTableProps {
  allocations: SubjectAllocation[];
  subjects: SubjectInput[];
}

/** Section E — full allocation + gap table. Cards on mobile, a real table from md up, per spec's "no forced horizontal scroll on mobile" rule. */
export function AllocationTable({ allocations, subjects }: AllocationTableProps) {
  function ratingLabel(subjectKey: SubjectAllocation["subjectKey"]) {
    const rating = subjects.find((s) => s.subjectKey === subjectKey)?.selfRating;
    return rating ? SELF_RATING_LABEL[rating] : "—";
  }

  return (
    <div>
      <div className="flex flex-col gap-3 md:hidden">
        {allocations.map((a) => (
          <Card key={a.subjectKey} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-body font-bold text-foreground">{a.label}</span>
              <span className="text-caption font-bold text-primary">{toPersianDigits(a.weeklyHours)} س/هفته</span>
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 text-caption text-muted-foreground">
              <span>خودارزیابی: {ratingLabel(a.subjectKey)}</span>
              <span>فاصله: {toPersianDigits(Math.max(0, a.gapToTarget))}٪</span>
              <span>درصد فعلی: {toPersianDigits(a.currentPercent)}٪</span>
              <span>درصد هدف: {toPersianDigits(a.targetPercent)}٪</span>
            </div>
            <p className="text-label text-muted-foreground">{explainAllocation(a, allocations)}</p>
          </Card>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <table className="w-full text-right text-caption">
          <thead className="bg-surface-alt text-foreground">
            <tr>
              <th className="px-3 py-2.5 font-semibold">درس</th>
              <th className="px-3 py-2.5 font-semibold">خودارزیابی</th>
              <th className="px-3 py-2.5 font-semibold">درصد فعلی</th>
              <th className="px-3 py-2.5 font-semibold">درصد هدف</th>
              <th className="px-3 py-2.5 font-semibold">فاصله</th>
              <th className="px-3 py-2.5 font-semibold">ساعت هفتگی</th>
              <th className="px-3 py-2.5 font-semibold">اولویت</th>
            </tr>
          </thead>
          <tbody className="bg-surface">
            {allocations.map((a) => (
              <tr key={a.subjectKey} className="border-t border-border">
                <td className="px-3 py-2.5 font-bold text-foreground">{a.label}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{ratingLabel(a.subjectKey)}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{toPersianDigits(a.currentPercent)}٪</td>
                <td className="px-3 py-2.5 text-muted-foreground">{toPersianDigits(a.targetPercent)}٪</td>
                <td className="px-3 py-2.5 text-muted-foreground">{toPersianDigits(Math.max(0, a.gapToTarget))}٪</td>
                <td className="px-3 py-2.5 font-bold text-primary">{toPersianDigits(a.weeklyHours)}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{explainAllocation(a, allocations)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
