"use client";

import { Input } from "@/design-system";
import type { PlannerFormData } from "../types";
import { StepField } from "./StepField";

interface StepFinalProps {
  data: Partial<PlannerFormData>;
  onChange: (update: Partial<PlannerFormData>) => void;
}

export function StepFinal({ data, onChange }: StepFinalProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-h1 font-bold text-foreground">دیگه تمومه</h1>
        <p className="text-body text-muted-foreground">همین چند لحظه‌ی دیگه برنامه‌ت آماده‌ست</p>
      </div>

      <StepField label="اسمت چیه؟" hint="اختیاری — تا نتیجه رو باهات شخصی‌سازی کنیم">
        <Input
          value={data.name ?? ""}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="اسمت رو بنویس"
        />
      </StepField>
    </div>
  );
}

export function isStepFinalValid(data: Partial<PlannerFormData>): boolean {
  return Boolean(data);
}
