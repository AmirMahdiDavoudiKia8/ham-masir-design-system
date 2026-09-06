import Image from "next/image";
import { ProfileIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface MentorAvatarProps {
  photo?: string;
  name?: string;
  size?: number;
  className?: string;
}

/** Shared avatar treatment for MentorCard and the mentor profile page — falls back to a placeholder icon when no photo exists. */
export function MentorAvatar({ photo, name, size = 64, className }: MentorAvatarProps) {
  return (
    <span
      className={cn("relative shrink-0 overflow-hidden rounded-full bg-muted shadow-card", className)}
      style={{ width: size, height: size }}
    >
      {photo ? (
        <Image src={photo} alt={name ?? "هم‌مسیر"} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-muted-foreground">
          {/* Placeholder avatar — no photo on file for this mentor */}
          <ProfileIcon style={{ width: size * 0.44, height: size * 0.44 }} />
        </span>
      )}
    </span>
  );
}
