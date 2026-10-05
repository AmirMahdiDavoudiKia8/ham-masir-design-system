import { toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { CalendarDay, CalendarDayStatus } from "@/lib/progress";

const WEEKDAY_LABELS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

interface MonthCalendarProps {
  monthLabel?: string;
  startWeekday: number;
  days: CalendarDay[];
  todayDay?: number;
  /** Live-computed status for the `todayDay` cell — never trust static data for "today", since ticking a task changes it. */
  todayLiveStatus: "empty" | "partial" | "complete";
  /** Days that have a mentor session on them (best-effort, resolved from bookings) — an overlay marker, independent of the study-status fill. */
  sessionDays: Set<number>;
  /** Clicking a day reveals that day's plan below the calendar. */
  onSelectDay: (day: number) => void;
  selectedDay: number | null;
}

const LEGEND: { status: CalendarDayStatus; label: string }[] = [
  { status: "complete", label: "انجام‌شده" },
  { status: "partial", label: "بخشی انجام‌شده" },
  { status: "missed", label: "جامانده" },
  { status: "rest", label: "استراحت" },
];

function cellClasses(status: CalendarDayStatus | undefined): string {
  switch (status) {
    case "complete":
      return "bg-primary text-primary-foreground";
    case "partial":
      return "bg-primary-soft text-primary";
    case "missed":
      return "bg-alert-soft text-alert-foreground";
    case "rest":
      return "bg-surface-alt text-muted-foreground";
    default:
      // No data yet (later this month) — quiet, uncommitted.
      return "text-muted-foreground";
  }
}

const DOT_CLASSES: Record<CalendarDayStatus, string> = {
  complete: "bg-primary",
  partial: "bg-primary-soft",
  missed: "bg-alert",
  today: "bg-surface",
  rest: "bg-surface-alt",
};

function LegendDot({ status }: { status: CalendarDayStatus }) {
  return <span aria-hidden className={cn("h-2.5 w-2.5 rounded-full border border-border", DOT_CLASSES[status])} />;
}

/** Month view — every cell shows a real Persian day number, is clickable to reveal that day's plan, and color is never the only signal (missed days and session days also get a small dot). */
export function MonthCalendar({
  monthLabel,
  startWeekday,
  days,
  todayDay,
  todayLiveStatus,
  sessionDays,
  onSelectDay,
  selectedDay,
}: MonthCalendarProps) {
  const lastDay = days.reduce((max, d) => Math.max(max, d.day), 0);
  const leadingBlanks = Array.from({ length: Math.max(0, startWeekday) });
  const byDay = new Map(days.map((d) => [d.day, d]));

  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
      {monthLabel && <p className="mb-3 text-h3 font-semibold text-foreground">{monthLabel}</p>}

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i} className="text-label font-medium text-muted-foreground">
            {label}
          </span>
        ))}

        {leadingBlanks.map((_, i) => (
          <span key={`blank-${i}`} aria-hidden />
        ))}

        {Array.from({ length: lastDay }, (_, i) => i + 1).map((day) => {
          const isToday = day === todayDay;
          const entry = byDay.get(day);
          const hasSession = sessionDays.has(day);
          const status = isToday
            ? todayLiveStatus === "complete"
              ? "complete"
              : todayLiveStatus === "partial"
                ? "partial"
                : undefined
            : entry?.status;

          return (
            <div key={day} className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => onSelectDay(day)}
                aria-pressed={selectedDay === day}
                aria-label={`برنامه‌ی روز ${toPersianDigits(day)}`}
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-full text-label font-bold transition-colors duration-standard ease-gentle",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-1 focus-visible:ring-offset-surface",
                  cellClasses(status),
                  isToday && "ring-2 ring-primary ring-offset-1 ring-offset-surface",
                  selectedDay === day && "ring-2 ring-secondary-dark ring-offset-1 ring-offset-surface",
                )}
              >
                {toPersianDigits(day)}
                {status === "missed" && (
                  <span aria-hidden className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-alert" />
                )}
                {hasSession && (
                  <span aria-hidden className="absolute -top-1 h-1.5 w-1.5 rounded-full bg-foreground" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          {LEGEND.map(({ status, label }) => (
            <span key={status} className="flex items-center gap-2 text-caption text-muted-foreground">
              <LegendDot status={status} />
              {label}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2.5 border-t border-border/70 pt-3">
          <span className="flex items-center gap-2 text-caption text-muted-foreground">
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-primary" />
            امروز
          </span>
          <span className="flex items-center gap-2 text-caption text-muted-foreground">
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full border border-border bg-foreground" />
            جلسه با هم‌مسیر
          </span>
        </div>
      </div>
    </div>
  );
}
