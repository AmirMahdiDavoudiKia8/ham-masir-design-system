"use client";

import { Chip } from "@/components/ui/Chip";
import { FemaleIcon, MaleIcon, UsersIcon } from "@/components/ui/icons";

export const GENDER_OPTIONS = [
  { key: "female", label: "خانم", Icon: FemaleIcon },
  { key: "male", label: "آقا", Icon: MaleIcon },
  { key: "any", label: "فرقی نمی‌کند", Icon: UsersIcon },
] as const;

export type GenderKey = (typeof GENDER_OPTIONS)[number]["key"];

interface GenderFilterProps {
  value: GenderKey;
  onChange: (value: GenderKey) => void;
}

/** Mentor gender preference filter. "any" means no filter is applied. */
export function GenderFilter({ value, onChange }: GenderFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {GENDER_OPTIONS.map(({ key, label, Icon }) => (
        <Chip key={key} selected={value === key} onClick={() => onChange(key)}>
          <Icon className="h-4 w-4" />
          {label}
        </Chip>
      ))}
    </div>
  );
}
