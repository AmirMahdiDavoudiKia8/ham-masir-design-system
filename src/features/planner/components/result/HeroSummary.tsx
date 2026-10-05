import { PHASE_LABEL } from "../../types";
import type { PlannerFormData, PlannerResult } from "../../types";
import { toPersianDigits } from "@/lib/format";
import { PHASE_EXPLANATION, getLevelNarrative, getLevelScienceText } from "../../explanations";

interface HeroSummaryProps {
  formData: PlannerFormData;
  result: PlannerResult;
}

/** Section A — the result page's opening card: greeting, "where you stand" framing, three key stats, phase guidance, and the engine's per-subject summary line. */
export function HeroSummary({ formData, result }: HeroSummaryProps) {
  const name = formData.name?.trim();

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 shadow-card animate-rise-in">
      <h1 className="text-h2 font-bold text-foreground">
        {name ? `سلام ${name}، ` : ""}بر اساس پاسخ‌هات، این برنامه‌ی توئه
      </h1>

      <p className="text-body leading-7 text-muted-foreground">{getLevelNarrative(result.overallLevelPercent)}</p>

      <div className="flex flex-col gap-1 rounded-md border border-dashed border-primary-light bg-primary-soft/40 px-3.5 py-3">
        <span className="text-label font-bold text-primary">می‌دونستی؟</span>
        <p className="text-caption leading-6 text-muted-foreground">{getLevelScienceText(result.overallLevelPercent)}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatBadge label="روز باقی‌مانده" value={toPersianDigits(result.daysLeft)} />
        <StatBadge label="فاز فعلی" value={PHASE_LABEL[result.phase]} />
        <StatBadge label="ساعت این هفته" value={`${toPersianDigits(result.weeklyTotalHours)} س`} />
      </div>

      <div className="flex flex-col gap-1 rounded-md bg-surface-alt px-3.5 py-3">
        <span className="text-label font-bold text-primary">توی {PHASE_LABEL[result.phase]} چیکار کنم؟</span>
        <p className="text-caption leading-6 text-muted-foreground">{PHASE_EXPLANATION[result.phase]}</p>
      </div>

      <p className="text-body leading-7 text-muted-foreground">{result.overallGapSummary}</p>
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-md bg-primary-soft px-2 py-3 text-center">
      <span className="text-h3 font-bold text-primary">{value}</span>
      <span className="text-label text-muted-foreground">{label}</span>
    </div>
  );
}
