"use client";

import { Card } from "@/design-system";
import { SELF_RATING_LABEL } from "../constants";
import { SUBJECT_LABEL, TRACK_SUBJECTS } from "../types";
import type { PlannerFormData, SelfRating, SubjectInput, SubjectKey } from "../types";
import { OptionButton } from "./OptionButton";
import { PlannerSlider } from "./PlannerSlider";
import { StepField } from "./StepField";

interface StepSubjectRatingProps {
  data: Partial<PlannerFormData>;
  onChange: (update: Partial<PlannerFormData>) => void;
}

const SELF_RATING_ORDER: SelfRating[] = ["veryWeak", "weak", "medium", "good"];

export function StepSubjectRating({ data, onChange }: StepSubjectRatingProps) {
  const track = data.track;
  if (!track) return null;

  const subjects = data.subjects ?? [];
  const subjectKeys = TRACK_SUBJECTS[track];

  function getSubject(key: SubjectKey): SubjectInput | undefined {
    return subjects.find((s) => s.subjectKey === key);
  }

  function updateSubject(key: SubjectKey, patch: Partial<SubjectInput>) {
    const existing = getSubject(key);
    const next: SubjectInput = existing ? { ...existing, ...patch } : { subjectKey: key, selfRating: "medium", ...patch };
    onChange({ subjects: [...subjects.filter((s) => s.subjectKey !== key), next] });
  }

  return (
    <div className="flex flex-col gap-6">
      {subjectKeys.map((key) => (
        <SubjectCard key={key} subjectKey={key} value={getSubject(key)} onChange={(patch) => updateSubject(key, patch)} />
      ))}
    </div>
  );
}

interface SubjectCardProps {
  subjectKey: SubjectKey;
  value: SubjectInput | undefined;
  onChange: (patch: Partial<SubjectInput>) => void;
}

function SubjectCard({ subjectKey, value, onChange }: SubjectCardProps) {
  const knowsPercent = value?.estimatedPercent !== undefined;

  return (
    <Card className="flex flex-col gap-5">
      <StepField label={`توی ${SUBJECT_LABEL[subjectKey]} خودت رو چطور می‌بینی؟`}>
        <div className="grid grid-cols-2 gap-2.5">
          {SELF_RATING_ORDER.map((rating) => (
            <OptionButton
              key={rating}
              label={SELF_RATING_LABEL[rating]}
              selected={value?.selfRating === rating}
              onClick={() => onChange({ selfRating: rating })}
            />
          ))}
        </div>
      </StepField>

      <StepField label="یه درصد حدودی از سطحت توی این درس بنویس">
        <div className="flex flex-col gap-2">
          {knowsPercent ? (
            <PlannerSlider
              label="درصد تقریبی"
              value={value?.estimatedPercent ?? 0}
              min={0}
              max={100}
              unit="٪"
              onChange={(percent) => onChange({ estimatedPercent: percent })}
            />
          ) : (
            <button
              type="button"
              onClick={() => onChange({ estimatedPercent: 30 })}
              className="self-start rounded-md border border-border bg-surface px-3.5 py-2 text-caption font-semibold text-foreground transition-colors duration-standard ease-gentle hover:border-primary-light hover:bg-primary-soft"
            >
              درصدشو می‌دونم، بزار وارد کنم
            </button>
          )}
          {knowsPercent && (
            <button
              type="button"
              onClick={() => onChange({ estimatedPercent: undefined })}
              className="self-start text-caption text-muted-foreground underline-offset-2 hover:underline"
            >
              نمی‌دونم
            </button>
          )}
        </div>
      </StepField>
    </Card>
  );
}

export function isStepSubjectRatingValid(data: Partial<PlannerFormData>): boolean {
  const track = data.track;
  if (!track) return false;
  const subjects = data.subjects ?? [];
  return TRACK_SUBJECTS[track].every((key) => subjects.some((s) => s.subjectKey === key && s.selfRating));
}
