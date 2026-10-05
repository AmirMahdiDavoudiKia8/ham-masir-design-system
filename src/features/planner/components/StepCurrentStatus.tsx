"use client";

import { Input } from "@/design-system";
import { digitsOnly } from "@/lib/format";
import { SUBJECT_LABEL, TRACK_SUBJECTS } from "../types";
import type { PlannerFormData, StudySeriousness, Track } from "../types";
import { OptionButton } from "./OptionButton";
import { PlannerSlider } from "./PlannerSlider";
import { StepField } from "./StepField";

interface StepCurrentStatusProps {
  data: Partial<PlannerFormData>;
  onChange: (update: Partial<PlannerFormData>) => void;
}

const SERIOUSNESS_OPTIONS: { value: StudySeriousness; label: string }[] = [
  { value: "justStarted", label: "تازه شروع کردم" },
  { value: "1to3m", label: "۱-۳ ماهه" },
  { value: "3to6m", label: "۳-۶ ماهه" },
  { value: "moreThan6m", label: "بیشتر از ۶ ماه" },
];

/** Lists all of the track's required subjects by name, Persian-joined ("X، Y و Z"), for the mock-exam average question — matches exactly what mockExamAvgPercent feeds into (see engine.ts's computeAllocations). */
function mockExamSubjectsLabel(track: Track): string {
  const labels = TRACK_SUBJECTS[track].map((key) => SUBJECT_LABEL[key]);
  if (labels.length <= 1) return labels[0] ?? "";
  return `${labels.slice(0, -1).join("، ")} و ${labels[labels.length - 1]}`;
}

export function StepCurrentStatus({ data, onChange }: StepCurrentStatusProps) {
  const currentDailyHours = data.currentDailyHours ?? 0;
  const mockExamSubjects = data.track ? mockExamSubjectsLabel(data.track) : "شیمی، فیزیک و ریاضی";

  return (
    <div className="flex flex-col gap-8">
      <StepField label="الان روزی چند ساعت مطالعه می‌کنی؟">
        <PlannerSlider
          label="ساعت مطالعه‌ی روزانه"
          value={currentDailyHours}
          min={0}
          max={14}
          unit=" ساعت"
          onChange={(value) => onChange({ currentDailyHours: value })}
        />
      </StepField>

      <StepField label="آزمون آزمایشی می‌دی؟">
        <div className="grid grid-cols-2 gap-2.5">
          <OptionButton
            label="بله"
            selected={data.hasTakenMockExam === true}
            onClick={() => onChange({ hasTakenMockExam: true })}
          />
          <OptionButton
            label="نه، هنوز آزمون نداده‌ام"
            selected={data.hasTakenMockExam === false}
            onClick={() => onChange({ hasTakenMockExam: false, mockExamYears: undefined, mockExamAvgPercent: undefined })}
          />
        </div>
      </StepField>

      {data.hasTakenMockExam && (
        <>
          <StepField label="چند ساله که آزمون می‌دی؟" hint="اختیاری">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={10}
              placeholder="مثلاً ۱"
              value={data.mockExamYears ?? ""}
              onChange={(e) => {
                const raw = digitsOnly(e.target.value);
                onChange({ mockExamYears: raw === "" ? undefined : Number(raw) });
              }}
            />
          </StepField>

          <StepField label={`میانگین درصد ${mockExamSubjects} توی آزمون‌ها تقریباً چقدره؟`} hint="اختیاری">
            <PlannerSlider
              label="میانگین درصد"
              value={data.mockExamAvgPercent ?? 0}
              min={0}
              max={100}
              unit="٪"
              onChange={(value) => onChange({ mockExamAvgPercent: value })}
            />
          </StepField>
        </>
      )}

      <StepField label="چند وقته که به‌طور جدی درس می‌خونی؟">
        <div className="grid grid-cols-2 gap-2.5">
          {SERIOUSNESS_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={data.studySeriousnessDuration === opt.value}
              onClick={() => onChange({ studySeriousnessDuration: opt.value })}
            />
          ))}
        </div>
      </StepField>
    </div>
  );
}

export function isStepCurrentStatusValid(data: Partial<PlannerFormData>): boolean {
  return (
    typeof data.currentDailyHours === "number" &&
    typeof data.hasTakenMockExam === "boolean" &&
    Boolean(data.studySeriousnessDuration)
  );
}
