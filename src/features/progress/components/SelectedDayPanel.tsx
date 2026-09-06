import { toPersianDigits } from "@/lib/format";
import { XIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { CalendarDayStatus, PlanDay } from "@/lib/progress";
import { ProgressRing } from "./ProgressRing";
import { TaskRow } from "./TaskRow";

interface SelectedDayPanelProps {
  day: number;
  /** The matching week-plan day, if this calendar day falls within the currently-loaded week. */
  planDay?: PlanDay;
  /** The calendar's own static status, used only when there's no plan-day detail to show. */
  status?: CalendarDayStatus;
  isFuture: boolean;
  onToggleTask: (taskId: string) => void;
  onClose: () => void;
  /** The one task currently round-tripping to the server, if any — see ProgressHome/TaskRow. */
  pendingTaskId?: string | null;
}

const STATUS_MESSAGE: Record<CalendarDayStatus, string> = {
  complete: "این روز رو کامل انجام دادی.",
  partial: "بخشی از برنامه‌ی این روز انجام شده بود.",
  missed: "این روز جا موند، ولی مهم نیست، از همین امروز ادامه بده.",
  rest: "این یه روز استراحتِ برنامه‌ریزی‌شده بود.",
  today: "امروز رو داری، برنامه‌ش پایین‌تره.",
};

/** Reveals a single day's plan when its calendar cell is clicked — the full task list if it's within this week, otherwise just a calm, status-based note. */
export function SelectedDayPanel({ day, planDay, status, isFuture, onToggleTask, onClose, pendingTaskId }: SelectedDayPanelProps) {
  const hasTasks = Boolean(planDay && planDay.tasks.length > 0);
  const dayPercent = planDay && planDay.tasks.length > 0
    ? Math.round((planDay.tasks.filter((t) => t.done).length / planDay.tasks.length) * 100)
    : 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 rounded-lg p-4",
        isFuture ? "border border-dashed border-border bg-surface-alt" : "border-2 border-secondary-dark bg-surface",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-foreground">{planDay?.dayLabel ?? `روز ${toPersianDigits(day)}`}</span>
        {planDay?.dateLabel && <span className="text-caption text-muted-foreground">{planDay.dateLabel}</span>}
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن"
          className="mr-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-standard ease-gentle hover:bg-muted"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      {planDay ? (
        planDay.tasks.length === 0 ? (
          <p className="text-caption text-muted-foreground">این روز برنامه‌ای ثبت نشده، استراحت کن.</p>
        ) : (
          <div className="flex items-start gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {planDay.tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  locked={isFuture}
                  pending={task.id === pendingTaskId}
                  onToggle={() => onToggleTask(task.id)}
                />
              ))}
            </div>
            {hasTasks && <ProgressRing percent={dayPercent} size={56} strokeWidth={6} labelClassName="text-label" />}
          </div>
        )
      ) : (
        <p className="text-caption text-muted-foreground">
          {status ? STATUS_MESSAGE[status] : "برای این روز جزئیاتی ثبت نشده."}
        </p>
      )}
    </div>
  );
}
