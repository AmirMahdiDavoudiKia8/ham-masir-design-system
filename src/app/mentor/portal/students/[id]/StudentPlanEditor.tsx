"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { XIcon } from "@/components/ui/icons";
import { WeeklyChecklist } from "@/features/progress/components/WeeklyChecklist";
import { cn } from "@/lib/cn";
import type { PlanDay, Task, TaskType } from "@/lib/progress";
import type { PortalStudent } from "@/lib/mentorPortal";
import { cancelStudent, saveStudentPlan, saveStudentSessions, toggleStudentTaskAsMentor } from "./actions";

interface StudentPlanEditorProps {
  student: PortalStudent;
}

const TASK_TYPES: TaskType[] = ["درسنامه", "تست"];

function newTask(): Task {
  return { id: crypto.randomUUID(), subject: "", topic: "", type: "درسنامه", target: "", done: false };
}

export function StudentPlanEditor({ student }: StudentPlanEditorProps) {
  const router = useRouter();
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [isCancelPending, startCancelTransition] = useTransition();
  const [weekLabel, setWeekLabel] = useState(student.weekLabel ?? "");
  const [days, setDays] = useState<PlanDay[]>(student.days);
  const [sessions, setSessions] = useState<string[]>(student.sessions);
  const [planSaved, setPlanSaved] = useState(false);
  const [sessionsSaved, setSessionsSaved] = useState(false);
  const [isPlanPending, startPlanTransition] = useTransition();
  const [isSessionsPending, startSessionsTransition] = useTransition();

  function updateDay(dayIndex: number, patch: Partial<PlanDay>) {
    setPlanSaved(false);
    setDays((prev) => prev.map((d, i) => (i === dayIndex ? { ...d, ...patch } : d)));
  }

  function setTodayIndex(dayIndex: number) {
    setPlanSaved(false);
    setDays((prev) => prev.map((d, i) => ({ ...d, isToday: i === dayIndex })));
  }

  function updateTask(dayIndex: number, taskId: string, patch: Partial<Task>) {
    setPlanSaved(false);
    setDays((prev) =>
      prev.map((d, i) =>
        i !== dayIndex ? d : { ...d, tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)) },
      ),
    );
  }

  function addTask(dayIndex: number) {
    setPlanSaved(false);
    setDays((prev) => prev.map((d, i) => (i === dayIndex ? { ...d, tasks: [...d.tasks, newTask()] } : d)));
  }

  function removeTask(dayIndex: number, taskId: string) {
    setPlanSaved(false);
    setDays((prev) =>
      prev.map((d, i) => (i !== dayIndex ? d : { ...d, tasks: d.tasks.filter((t) => t.id !== taskId) })),
    );
  }

  // Fires straight to the server (see toggleStudentTaskAsMentor) instead of
  // waiting for "ذخیره برنامه" — that button only ever saves plan
  // *structure* now, precisely so it can never revert a tick either side
  // makes in between. Local `days` still updates optimistically so this
  // checklist reflects the tap instantly.
  function handleToggleDone(taskId: string) {
    setDays((prev) =>
      prev.map((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) })),
    );
    toggleStudentTaskAsMentor(student.id, taskId).catch(() => {});
  }

  function handleSavePlan() {
    startPlanTransition(async () => {
      await saveStudentPlan(student.id, weekLabel, days);
      setPlanSaved(true);
    });
  }

  function updateSession(index: number, value: string) {
    setSessionsSaved(false);
    setSessions((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function addSession() {
    setSessionsSaved(false);
    setSessions((prev) => [...prev, ""]);
  }

  function removeSession(index: number) {
    setSessionsSaved(false);
    setSessions((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSaveSessions() {
    startSessionsTransition(async () => {
      await saveStudentSessions(student.id, sessions);
      setSessionsSaved(true);
    });
  }

  function handleCancel() {
    startCancelTransition(async () => {
      await cancelStudent(student.id);
      router.refresh();
    });
  }

  if (student.cancelled) {
    return (
      <div className="flex flex-col gap-3 rounded-lg bg-alert-soft p-4">
        <p className="text-body font-semibold text-danger">
          {student.cancelled.by === "mentor" ? `خودت این دانش‌آموز رو لغو کردی.` : `${student.name} این همراهی رو لغو کرد.`}
        </p>
        {student.cancelled.reason && (
          <p className="text-caption text-foreground">دلیل: {student.cancelled.reason}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
        <h2 className="text-h3 font-bold text-foreground">ساعت‌های مشاوره</h2>
        <div className="flex flex-col gap-2">
          {sessions.map((session, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={session}
                onChange={(e) => updateSession(i, e.target.value)}
                placeholder="مثلاً شنبه ساعت ۲۰:۰۰"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeSession(i)}
                aria-label="حذف زمان"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-standard ease-gentle hover:bg-alert-soft hover:text-danger"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSession}
            className="cursor-pointer rounded-md border border-dashed border-border py-2 text-label font-semibold text-muted-foreground transition-colors duration-standard ease-gentle hover:border-primary-light hover:text-primary"
          >
            + افزودن زمان
          </button>
        </div>
        <Button size="md" fullWidth onClick={handleSaveSessions} disabled={isSessionsPending}>
          {isSessionsPending ? "در حال ذخیره…" : "ذخیره ساعت‌ها"}
        </Button>
        {sessionsSaved && !isSessionsPending && (
          <p className="text-center text-caption font-semibold text-success">ذخیره شد ✓</p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-label font-semibold text-muted-foreground">عنوان هفته</label>
          <Input value={weekLabel} onChange={(e) => { setPlanSaved(false); setWeekLabel(e.target.value); }} placeholder="برنامه‌ی این هفته" />
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

        <Button size="lg" fullWidth onClick={handleSavePlan} disabled={isPlanPending}>
          {isPlanPending ? "در حال ذخیره…" : "ذخیره برنامه"}
        </Button>
        {planSaved && !isPlanPending && <p className="text-center text-caption font-semibold text-success">ذخیره شد ✓</p>}
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <h2 className="text-h3 font-bold text-foreground">پیشرفت {student.name}</h2>
        <p className="text-label text-muted-foreground">
          با زدن روی هر درس، وضعیتش رو انجام‌شده/نشده کن — همون لحظه ذخیره می‌شه.
        </p>
        <WeeklyChecklist weekLabel={undefined} days={days} onToggleTask={handleToggleDone} />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-danger/30 bg-alert-soft p-4">
        <h2 className="text-h3 font-bold text-danger">لغو همراهی</h2>
        <p className="text-caption font-semibold text-foreground">
          حتما قبلش با من (امیرمهدی داودی‌کیا) هماهنگ کن، بعد دکمه‌ی لغو رو بزن.
        </p>
        {confirmingCancel ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isCancelPending}
              className="h-11 flex-1 cursor-pointer rounded-md bg-danger text-caption font-bold text-danger-foreground transition-all duration-standard ease-gentle active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCancelPending ? "در حال لغو…" : "بله، مطمئنم"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingCancel(false)}
              disabled={isCancelPending}
              className="h-11 flex-1 cursor-pointer rounded-md border border-border text-caption font-bold text-foreground transition-colors duration-standard ease-gentle hover:bg-muted"
            >
              منصرف شدم
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingCancel(true)}
            className="h-11 cursor-pointer rounded-md border border-danger/40 text-caption font-bold text-danger transition-colors duration-standard ease-gentle hover:bg-danger/10"
          >
            لغو {student.name}
          </button>
        )}
      </div>
    </div>
  );
}
