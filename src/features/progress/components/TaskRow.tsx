"use client";

import { CheckIcon, LockIcon } from "@/design-system";
import { cn } from "@/lib/cn";
import type { Task } from "@/lib/progress";

interface TaskRowProps {
  task: Task;
  onToggle: () => void;
  /** Future days can't be ticked ahead of time — this is a calm accountability app, not a race to check things off early. */
  locked?: boolean;
  /** True while this exact task's toggle is round-tripping to the server (see ProgressHome) — disabled the same way a locked row is, so a second tap can't fire before the first one's server write actually lands. */
  pending?: boolean;
}

/** A tick-able task row — same selected-circle visual language as PlanOption. Completing a task is quiet, not celebratory: text just settles into muted + line-through. */
export function TaskRow({ task, onToggle, locked = false, pending = false }: TaskRowProps) {
  const { subject, topic, target, done } = task;
  const line = [subject, topic, target].filter(Boolean).join("، ");

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={locked || pending}
      aria-pressed={done}
      aria-busy={pending}
      aria-label={locked ? `${line || "بدون عنوان"}، هنوز نرسیده` : undefined}
      className={cn(
        "flex min-h-[48px] w-full items-start gap-3 rounded-md border-2 px-4 py-3 text-right transition-all duration-standard ease-gentle active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
        done ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-primary-light",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-standard ease-gentle",
          done ? "border-primary bg-primary" : "border-border bg-surface",
        )}
      >
        {done && <CheckIcon className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
        {!done && locked && <LockIcon className="h-3 w-3 text-muted-foreground" strokeWidth={2.25} />}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "line-clamp-2 text-label font-semibold",
            done ? "text-muted-foreground line-through" : "text-foreground",
          )}
        >
          {line || "بدون عنوان"}
        </span>
      </span>
    </button>
  );
}
