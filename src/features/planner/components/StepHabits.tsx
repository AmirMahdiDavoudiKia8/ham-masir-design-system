"use client";

import type { PlannerFormData, StudyMode, StudyTimePref } from "../types";
import { OptionButton } from "./OptionButton";
import { StepField } from "./StepField";

interface StepHabitsProps {
  data: Partial<PlannerFormData>;
  onChange: (update: Partial<PlannerFormData>) => void;
}

const FOCUS_TIME_OPTIONS: { value: StudyTimePref; label: string }[] = [
  { value: "morning", label: "صبح زود" },
  { value: "afternoon", label: "بعدازظهر" },
  { value: "night", label: "شب" },
];

const CHALLENGE_OPTIONS = [
  "کمبود وقت",
  "تمرکز پایین",
  "نمی‌دونم از کجا شروع کنم",
  "پشتکار و استمرار",
  "اضطراب امتحان",
  "حجم زیاد مطالب",
];

const STUDY_MODE_OPTIONS: { value: StudyMode; label: string }[] = [
  { value: "content", label: "خوندن درسنامه - ویدیوی آموزشی" },
  { value: "test", label: "تست زدن" },
  { value: "balanced", label: "هر دو تقریباً مساوی" },
];

const MAX_CHALLENGES = 2;

export function StepHabits({ data, onChange }: StepHabitsProps) {
  const challenges = data.mainChallenges ?? [];

  function toggleChallenge(challenge: string) {
    if (challenges.includes(challenge)) {
      onChange({ mainChallenges: challenges.filter((c) => c !== challenge) });
      return;
    }
    if (challenges.length >= MAX_CHALLENGES) return;
    onChange({ mainChallenges: [...challenges, challenge] });
  }

  return (
    <div className="flex flex-col gap-8">
      <StepField label="کِی از روز تمرکز بیشتری داری؟">
        <div className="grid grid-cols-3 gap-2.5">
          {FOCUS_TIME_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={data.focusTime === opt.value}
              onClick={() => onChange({ focusTime: opt.value })}
            />
          ))}
        </div>
      </StepField>

      <StepField label="مشکل اصلیت توی درس خوندن چیه؟" hint="حداکثر ۲ تا انتخاب کن">
        <div className="grid grid-cols-2 gap-2.5">
          {CHALLENGE_OPTIONS.map((challenge) => (
            <OptionButton
              key={challenge}
              label={challenge}
              selected={challenges.includes(challenge)}
              onClick={() => toggleChallenge(challenge)}
              className="py-3.5"
            />
          ))}
        </div>
      </StepField>

      <StepField label="معمولاً بیشتر وقتت رو صرف چی می‌کنی؟">
        <div className="flex flex-col gap-2.5">
          {STUDY_MODE_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={data.currentStudyMode === opt.value}
              onClick={() => onChange({ currentStudyMode: opt.value })}
              className="py-3.5"
            />
          ))}
        </div>
      </StepField>
    </div>
  );
}

export function isStepHabitsValid(data: Partial<PlannerFormData>): boolean {
  return Boolean(data.focusTime) && (data.mainChallenges?.length ?? 0) > 0 && Boolean(data.currentStudyMode);
}
