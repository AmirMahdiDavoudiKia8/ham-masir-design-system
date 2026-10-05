/**
 * Tag — small read-only label pill for display metadata.
 * Unlike Chip, never selectable/interactive.
 *
 * Status: canonical — shipped for booking status and availability labels.
 */
import * as React from "react";
import { cn } from "@/lib/cn";

export type TagProps = React.HTMLAttributes<HTMLSpanElement>;

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
export default Tag;
