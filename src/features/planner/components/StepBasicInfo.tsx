"use client";

import { Input } from "@/components/ui/Input";
import { digitsOnly, toPersianDigits } from "@/lib/format";
import { guessDaysUntilExam } from "../engine";
import type { GradeLevel, PlannerFormData, Track } from "../types";
import { OptionButton } from "./OptionButton";
import { StepField } from "./StepField";

interface StepBasicInfoProps {
  data: Partial<PlannerFormData>;
  onChange: (update: Partial<PlannerFormData>) => void;
}

const GRADE_OPTIONS: { value: GradeLevel; label: string }[] = [
  { value: "dahom", label: "دهم" },
  { value: "yazdahom", label: "یازدهم" },
  { value: "davazdahom", label: "دوازدهم" },
  { value: "farighotahsil", label: "فارغ‌التحصیل (پشت‌کنکوری)" },
];

// v1 only activates تجربی/ریاضی — انسانی/هنر/زبان come later (see spec section 3, Step 1).
const TRACK_OPTIONS: { value: Track; label: string }[] = [
  { value: "tajrobi", label: "تجربی" },
  { value: "riazi", label: "ریاضی" },
];

export function StepBasicInfo({ data, onChange }: StepBasicInfoProps) {
  const daysUntilExam = data.daysUntilExam;
  const isPast = daysUntilExam !== undefined && daysUntilExam <= 0;

  return (
    <div className="flex flex-col gap-8">
      <StepField label="پایه‌ی تحصیلی فعلی‌ات چیه؟">
        <div className="grid grid-cols-2 gap-2.5">
          {GRADE_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={data.grade === opt.value}
              onClick={() => onChange({ grade: opt.value })}
            />
          ))}
        </div>
      </StepField>

      <StepField label="رشته‌ات چیه؟">
        <div className="grid grid-cols-2 gap-2.5">
          {TRACK_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={data.track === opt.value}
              onClick={() => onChange({ track: opt.value, subjects: [], interestedFields: [] })}
            />
          ))}
        </div>
      </StepField>

      <StepField label="چند روز تا کنکورت مونده؟">
        <div className="flex flex-col gap-2">
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="مثلاً ۱۸۰"
            value={daysUntilExam ?? ""}
            onChange={(e) => {
              const raw = digitsOnly(e.target.value);
              onChange({ daysUntilExam: raw === "" ? undefined : Number(raw) });
            }}
          />
          {data.grade && (
            <button
              type="button"
              onClick={() => onChange({ daysUntilExam: guessDaysUntilExam(data.grade!) })}
              className="self-start text-caption font-semibold text-primary underline-offset-2 hover:underline"
            >
              دقیق نمی‌دونم — یه عدد تقریبی بذار
            </button>
          )}
          {isPast && <p className="text-caption font-semibold text-danger">این عدد باید بزرگ‌تر از صفر باشه.</p>}
          {daysUntilExam !== undefined && !isPast && (
            <p className="text-caption text-muted-foreground">{toPersianDigits(daysUntilExam)} روز تا کنکور</p>
          )}
        </div>
      </StepField>
    </div>
  );
}

export function isStepBasicInfoValid(data: Partial<PlannerFormData>): boolean {
  return Boolean(data.grade && data.track && typeof data.daysUntilExam === "number" && data.daysUntilExam > 0);
}
