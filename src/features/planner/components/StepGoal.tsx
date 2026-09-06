"use client";

import { Chip } from "@/components/ui/Chip";
import { FIELDS_BY_TRACK } from "@/features/discovery/fieldsByTrack";
import { GOAL_TIER_LABEL, TRACK_LABEL_FA } from "../constants";
import type { GoalTier, PlannerFormData, Track } from "../types";
import { OptionButton } from "./OptionButton";
import { StepField } from "./StepField";

interface StepGoalProps {
  data: Partial<PlannerFormData>;
  onChange: (update: Partial<PlannerFormData>) => void;
}

const GOAL_TIER_ORDER: GoalTier[] = ["anyField", "under8000", "under3000", "under1000", "top200"];

/** Track-appropriate fields, sourced from the same list Discover's own field filter uses (features/discovery/fieldsByTrack.ts) — a ریاضی student was never going into پزشکی, so this list must not repeat the same options for both tracks. */
function fieldOptionsFor(track: Track | undefined): string[] {
  if (!track) return [];
  const base = FIELDS_BY_TRACK[TRACK_LABEL_FA[track]] ?? [];
  return [...base, "علوم پایه", "نمی‌دونم"];
}

export function StepGoal({ data, onChange }: StepGoalProps) {
  const fields = data.interestedFields ?? [];
  const fieldOptions = fieldOptionsFor(data.track);

  function toggleField(field: string) {
    onChange({
      interestedFields: fields.includes(field) ? fields.filter((f) => f !== field) : [...fields, field],
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <StepField label="هدفت از کنکور چیه؟">
        <div className="flex flex-col gap-2.5">
          {GOAL_TIER_ORDER.map((tier) => (
            <OptionButton
              key={tier}
              label={GOAL_TIER_LABEL[tier]}
              selected={data.goalTier === tier}
              onClick={() => onChange({ goalTier: tier })}
              className="py-3.5"
            />
          ))}
        </div>
      </StepField>

      <StepField label="رشته‌ی دانشگاهی مورد علاقه‌ات (اگه مشخصه)" hint="می‌تونی چند تا رو انتخاب کنی">
        <div className="flex flex-wrap gap-2">
          {fieldOptions.map((field) => (
            <Chip key={field} selected={fields.includes(field)} onClick={() => toggleField(field)}>
              {field}
            </Chip>
          ))}
        </div>
      </StepField>
    </div>
  );
}

export function isStepGoalValid(data: Partial<PlannerFormData>): boolean {
  return Boolean(data.goalTier);
}
