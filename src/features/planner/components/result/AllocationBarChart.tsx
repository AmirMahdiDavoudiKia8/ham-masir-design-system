import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { explainAllocation } from "../../explanations";
import type { ReasonTag, SubjectAllocation } from "../../types";

interface AllocationBarChartProps {
  allocations: SubjectAllocation[];
}

/** Bar fill per reasonTag — brand-only tints (teal/peach), never an outside red/yellow, per the spec's "stay in the brand palette" rule. */
const BAR_CLASS: Record<ReasonTag, string> = {
  weakHighWeight: "bg-gradient-to-l from-secondary-dark to-secondary",
  onTrack: "bg-gradient-to-l from-primary-hover to-primary",
  strongMaintain: "bg-primary-light",
};

/** Section C — one horizontal bar per subject, length = weekly hours, colored and captioned by why that many hours were assigned. */
export function AllocationBarChart({ allocations }: AllocationBarChartProps) {
  const max = Math.max(...allocations.map((a) => a.weeklyHours), 1);

  return (
    <div className="flex flex-col gap-5">
      {allocations.map((a) => (
        <div key={a.subjectKey} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-caption font-bold text-foreground">
            <span>{a.label}</span>
            <span className="text-primary">{toPersianDigits(a.weeklyHours)} ساعت در هفته</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-[width] duration-entrance ease-gentle", BAR_CLASS[a.reasonTag])}
              style={{ width: `${(a.weeklyHours / max) * 100}%` }}
            />
          </div>
          <p className="text-label text-muted-foreground">{explainAllocation(a, allocations)}</p>
        </div>
      ))}
    </div>
  );
}
