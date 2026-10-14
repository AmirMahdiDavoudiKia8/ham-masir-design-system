/**
 * Tag — CATEGORIZATION-only flat label for display metadata (e.g. field,
 * city, availability). Always a <span>: non-interactive by construction —
 * no hover, no focus, no cursor, no button semantics. For selectable filters
 * use Chip; for booking states use Badge; for actions use Button.
 *
 * Flat + subtle: soft tinted background, AA foreground, pill shape.
 * Binds only to semantic tokens. No hardcoded hex.
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
        "inline-flex select-none items-center whitespace-nowrap rounded-full bg-secondary-soft px-3 py-1 text-label font-semibold text-secondary-foreground",
        className,
      )}
      {...props}
    />
  );
}
export default Tag;
