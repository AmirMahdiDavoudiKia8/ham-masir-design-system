import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TagProps = HTMLAttributes<HTMLSpanElement>;

/** Small read-only label pill for display metadata — unlike Chip, never selectable/interactive. */
export function Tag({ className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-secondary-soft px-2.5 py-1 text-label font-semibold text-secondary-dark",
        className,
      )}
      {...props}
    />
  );
}
