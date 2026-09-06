import { CheckIcon, SparkleIcon } from "@/components/ui/icons";
import { toPersianDigits } from "@/lib/format";
import { buildStrengthWeaknessSummary } from "../../explanations";
import type { SubjectAllocation } from "../../types";

interface StrengthWeaknessCardProps {
  allocations: SubjectAllocation[];
}

function strengthCaption(a: SubjectAllocation): string {
  const gap = Math.round(a.gapToTarget);
  return gap <= 0 ? `${toPersianDigits(Math.abs(gap))}٪ جلوتر از هدفتی` : `فقط ${toPersianDigits(gap)}٪ تا هدفت مونده`;
}

function growthCaption(a: SubjectAllocation): string {
  return `${toPersianDigits(Math.round(a.gapToTarget))}٪ تا هدفت فاصله داری`;
}

/** A scannable 2+2 summary distinct from the full table — quick "what's working, what needs the most attention" read at a glance. */
export function StrengthWeaknessCard({ allocations }: StrengthWeaknessCardProps) {
  const { strengths, growthAreas } = buildStrengthWeaknessSummary(allocations);
  if (strengths.length === 0 && growthAreas.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {strengths.length > 0 && (
        <List
          title="نقاط قوتت"
          icon={<CheckIcon className="h-4 w-4" />}
          iconClassName="bg-primary-soft text-primary"
          items={strengths.map((a) => ({ key: a.subjectKey, label: a.label, caption: strengthCaption(a) }))}
        />
      )}
      {growthAreas.length > 0 && (
        <List
          title="جاهایی که بیشترین رشد رو می‌کنی"
          icon={<SparkleIcon className="h-4 w-4" />}
          iconClassName="bg-secondary-soft text-secondary-dark"
          items={growthAreas.map((a) => ({ key: a.subjectKey, label: a.label, caption: growthCaption(a) }))}
        />
      )}
    </div>
  );
}

interface ListProps {
  title: string;
  icon: React.ReactNode;
  iconClassName: string;
  items: { key: string; label: string; caption: string }[];
}

function List({ title, icon, iconClassName, items }: ListProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-caption font-bold text-foreground">{title}</h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2.5">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconClassName}`}>{icon}</span>
            <div className="flex flex-col">
              <span className="text-caption font-bold text-foreground">{item.label}</span>
              <span className="text-label text-muted-foreground">{item.caption}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
