"use client";

import { LockIcon } from "@/design-system";
import { cn } from "@/lib/cn";
import type { PlanDay } from "@/lib/progress";
import { ProgressRing } from "./ProgressRing";
import { TaskRow } from "./TaskRow";

interface WeeklyChecklistProps {
  weekLabel?: string;
  days: PlanDay[];
  onToggleTask: (taskId: string) => void;
  /** The one task currently round-tripping to the server, if any — see ProgressHome/TaskRow. */
  pendingTaskId?: string | null;
}

/**
 * The mentor's weekly plan, rendered day by day as a tick-able checklist —
 * this IS the plan, not a separate to-do list. Days after today are locked:
 * this is calm accountability, not a race, so there's no getting ahead of
 * the plan by ticking tomorrow's tasks early.
 */
export function WeeklyChecklist({ weekLabel, days, onToggleTask, pendingTaskId }: WeeklyChecklistProps) {
  const todayIndex = days.findIndex((d) => d.isToday);

  return (
    <div className="flex flex-col gap-4">
      {weekLabel && <h2 className="text-h2 font-semibold text-foreground">{weekLabel}</h2>}

      {days.map((day, i) => {
        const isFuture = todayIndex !== -1 && i > todayIndex;
        const dayPercent =
          day.tasks.length > 0 ? Math.round((day.tasks.filter((t) => t.done).length / day.tasks.length) * 100) : 0;

        return (
          <div
            key={`${day.dayLabel ?? "day"}-${i}`}
            className={cn(
              "flex items-start gap-4 rounded-lg p-4",
              day.isToday
                ? "border-2 border-primary bg-primary-soft"
                : isFuture
                  ? "border border-dashed border-border bg-surface-alt"
                  : "border border-border bg-surface",
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-bold", day.isToday ? "text-primary" : "text-foreground")}>
                  {day.dayLabel ?? "—"}
                </span>
                {day.dateLabel && <span className="text-caption text-muted-foreground">{day.dateLabel}</span>}
                {day.isToday && (
                  <span className="mr-auto rounded-full bg-primary px-2 py-0.5 text-label font-medium text-primary-foreground">
                    امروز
                  </span>
                )}
                {isFuture && day.tasks.length > 0 && (
                  <span className="mr-auto flex items-center gap-1 text-label font-medium text-muted-foreground">
                    <LockIcon className="h-3 w-3" />
                    هنوز نرسیده
                  </span>
                )}
              </div>

              {day.tasks.length === 0 ? (
                <p className="text-caption text-muted-foreground">امروز برنامه‌ای نداری، استراحت کن.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {day.tasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      locked={isFuture}
                      pending={task.id === pendingTaskId}
                      onToggle={() => onToggleTask(task.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {day.tasks.length > 0 && (
              <ProgressRing percent={dayPercent} size={56} strokeWidth={6} labelClassName="text-label" />
            )}
          </div>
        );
      })}
    </div>
  );
}
