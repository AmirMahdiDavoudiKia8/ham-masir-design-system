"use client";

import { Chip } from "@/design-system";
import { SuggestInput } from "./SuggestInput";
import { MapPinIcon } from "@/design-system";
import { UNIVERSITY_OPTIONS } from "@/lib/universityLogos";

const PRESET_CITIES = ["تهران", "اصفهان", "مشهد"];

const UNIVERSITY_SUGGESTIONS = UNIVERSITY_OPTIONS.map((u) => u.name);

interface UniversityFilterProps {
  city: string | null;
  onCityChange: (city: string | null) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

/** University filter: quick-pick city chips plus a free-text search with suggestions — both feed the same "university" match. */
export function UniversityFilter({ city, onCityChange, search, onSearchChange }: UniversityFilterProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {PRESET_CITIES.map((cityLabel) => (
          <Chip
            key={cityLabel}
            selected={city === cityLabel}
            onClick={() => onCityChange(city === cityLabel ? null : cityLabel)}
          >
            <MapPinIcon className="h-4 w-4" />
            {cityLabel}
          </Chip>
        ))}
      </div>
      <SuggestInput
        value={search}
        onChange={onSearchChange}
        suggestions={UNIVERSITY_SUGGESTIONS}
        placeholder="جستجوی نام دانشگاه..."
      />
    </div>
  );
}
