import { ClockIcon } from "@/design-system";
import { Tag } from "@/design-system";
import type { Mentor } from "@/lib/mentors";

interface MentorAvailabilityProps {
  mentor: Mentor;
}

/** Quiet, read-only context — not the booking calendar. Actually proposing a time happens one step later, in the booking flow. */
export function MentorAvailability({ mentor }: MentorAvailabilityProps) {
  const windows = mentor.availabilityWindows;
  if (!windows || windows.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-label font-bold text-muted-foreground">
        <ClockIcon className="h-4 w-4" />
        معمولاً این‌موقع‌ها در دسترسه
      </h2>
      <div className="flex flex-wrap gap-2">
        {windows.map((w) => (
          <Tag key={w}>{w}</Tag>
        ))}
      </div>
    </section>
  );
}
