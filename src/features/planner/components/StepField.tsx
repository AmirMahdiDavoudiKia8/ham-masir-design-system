import type { ReactNode } from "react";

interface StepFieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

/** Label + optional hint wrapper shared by every question block across the planner's steps. */
export function StepField({ label, hint, children }: StepFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-h3 font-bold text-foreground">{label}</h2>
        {hint && <p className="text-caption text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
