"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { XIcon } from "@/components/ui/icons";
import { WeeklyChecklist } from "@/features/progress/components/WeeklyChecklist";
import { cn } from "@/lib/cn";
import type { PlanDay, Task, TaskType } from "@/lib/progress";
import { useProgressStore } from "@/store/progressStore";
import { saveStudyPlan } from "./actions";

interface PlanEditorFormProps {
  initialWeekLabel: string;
  initialDays: PlanDay[];
}

const TASK_TYPES: TaskType[] = ["درسنامه", "تست"];

function newTask(): Task {
  return { id: crypto.randomUUID(), subject: "", topic: "", type: "درسنامه", target: "", done: false };
}

/**
 * The write half (day/task editor) and the view half (the exact same
 * WeeklyChecklist the student sees, wired to the real progressStore) live in
 * one component so saving and checking progress happen on one screen — see
 * actions.ts for the single-shared-demo-student caveat.
 */
export function PlanEditorForm({ initialWeekLabel, initialDays }: PlanEditorFormProps) {
  const [weekLabel, setWeekLabel] = useState(initialWeekLabel);
  const [days, setDays] = useState<PlanDay[]>(initialDays);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const doneOverrides = useProgressStore((s) => s.doneOverrides);
  const toggleTask = useProgressStore((s) => s.toggleTask);

  function markDirty() {
    setSaved(false);
  }

  function updateDay(dayIndex: number, patch: Partial<PlanDay>) {
    markDirty();
    setDays((prev) => prev.map((d, i) => (i === dayIndex ? { ...d, ...patch } : d)));
  }

  function setTodayIndex(dayIndex: number) {
    markDirty();
    setDays((prev) => prev.map((d, i) => ({ ...d, isToday: i === dayIndex })));
  }

  function updateTask(dayIndex: number, taskId: string, patch: Partial<Task>) {
    markDirty();
    setDays((prev) =>
      prev.map((d, i) =>
        i !== dayIndex ? d : { ...d, tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)) },
      ),
    );
  }

  function addTask(dayIndex: number) {
    markDirty();
    setDays((prev) => prev.map((d, i) => (i === dayIndex ? { ...d, tasks: [...d.tasks, newTask()] } : d)));
  }

  function removeTask(dayIndex: number, taskId: string) {
    markDirty();
    setDays((prev) =>
      prev.map((d, i) => (i !== dayIndex ? d : { ...d, tasks: d.tasks.filter((t) => t.id !== taskId) })),
    );
  }

  function handleSave() {
    startTransition(async () => {
      await saveStudyPlan(weekLabel, days);
      setSaved(true);
    });
  }

  function isTaskDone(task: Task): boolean {
    return doneOverrides[task.id] ?? task.done;
  }

  function handleToggle(taskId: string) {
    const task = days.flatMap((d) => d.tasks).find((t) => t.id === taskId);
    toggleTask(taskId, task ? isTaskDone(task) : false);
  }

  const previewDays = days.map((d) => ({ ...d, tasks: d.tasks.map((t) => ({ ...t, done: isTaskDone(t) })) }));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-label font-semibold text-muted-foreground">عنوان هفته</label>
          <Input
            value={weekLabel}
            onChange={(e) => {
              markDirty();
              setWeekLabel(e.target.value);
            }}
            placeholder="برنامه‌ی این هفته"
          />
        </div>

        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <Input
                value={day.dayLabel ?? ""}
                onChange={(e) => updateDay(dayIndex, { dayLabel: e.target.value })}
                placeholder="روز"
                className="flex-1"
              />
              <Input
                value={day.dateLabel ?? ""}
                onChange={(e) => updateDay(dayIndex, { dateLabel: e.target.value })}
                placeholder="تاریخ"
                className="flex-1"
              />
              <Chip selected={Boolean(day.isToday)} onClick={() => setTodayIndex(dayIndex)} className="shrink-0">
                امروز
              </Chip>
            </div>

            <div className="flex flex-col gap-2.5">
              {day.tasks.map((task) => (
                <div key={task.id} className="flex flex-col gap-2 rounded-md bg-surface-alt p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={task.subject ?? ""}
                      onChange={(e) => updateTask(dayIndex, task.id, { subject: e.target.value })}
                      placeholder="درس"
                      className="flex-1"
                    />
                    <Input
                      value={task.topic ?? ""}
                      onChange={(e) => updateTask(dayIndex, task.id, { topic: e.target.value })}
                      placeholder="موضوع"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeTask(dayIndex, task.id)}
                      aria-label="حذف درس"
                      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-standard ease-gentle hover:bg-alert-soft hover:text-danger"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={task.target ?? ""}
                      onChange={(e) => updateTask(dayIndex, task.id, { target: e.target.value })}
                      placeholder="مقدار (مثلاً ۳۰ تست)"
                      className="flex-1"
                    />
                    <div className="flex shrink-0 gap-1.5">
                      {TASK_TYPES.map((type) => (
                        <Chip
                          key={type}
                          selected={task.type === type}
                          onClick={() => updateTask(dayIndex, task.id, { type })}
                        >
                          {type}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addTask(dayIndex)}
                className={cn(
                  "cursor-pointer rounded-md border border-dashed border-border py-2 text-label font-semibold text-muted-foreground",
                  "transition-colors duration-standard ease-gentle hover:border-primary-light hover:text-primary",
                )}
              >
                + افزودن درس
              </button>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <Button size="lg" fullWidth onClick={handleSave} disabled={isPending}>
            {isPending ? "در حال ذخیره…" : "ذخیره برنامه"}
          </Button>
        </div>
        {saved && !isPending && <p className="text-center text-caption font-semibold text-success">ذخیره شد ✓</p>}
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <h2 className="text-h3 font-bold text-foreground">پیشرفت دانش‌آموز روی این برنامه</h2>
        <WeeklyChecklist weekLabel={undefined} days={previewDays} onToggleTask={handleToggle} />
      </div>
    </div>
  );
}
