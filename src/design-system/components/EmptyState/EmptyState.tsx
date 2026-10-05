/**
 * EmptyState — generic empty-state block, an invitation rather than a void.
 * Reusable wherever a list/search can come back with nothing.
 */
import * as React from "react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface-alt px-6 py-12 text-center">
      {icon && (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-h3 font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="max-w-[26rem] text-caption text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
export default EmptyState;
