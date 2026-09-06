import { AwardIcon } from "@/components/ui/icons";
import type { Mentor } from "@/lib/mentors";
import { MentorAvatar } from "./MentorAvatar";

interface MentorIdentityProps {
  mentor: Mentor;
}

/**
 * Calm, generous credentials — name, field/university, rank. Rendered by
 * the profile page inside a `relative` wrapper with a negative top margin,
 * so the avatar's white ring straddles the gradient banner above it rather
 * than sitting flush below it.
 */
export function MentorIdentity({ mentor }: MentorIdentityProps) {
  const { name, photo, field, university, rank } = mentor;
  const subtitle = [field, university].filter(Boolean).join("، ");

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <MentorAvatar photo={photo} name={name} size={96} className="ring-4 ring-surface" />

      <h1
        className={
          name ? "text-h1 font-bold text-foreground" : "text-h1 font-bold text-muted-foreground"
        }
      >
        {name ?? "هم‌مسیر"}
      </h1>

      {subtitle && <p className="text-body text-muted-foreground">{subtitle}</p>}

      {rank && (
        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-caption font-bold text-primary">
          <AwardIcon className="h-4 w-4" />
          {rank}
        </span>
      )}
    </div>
  );
}
