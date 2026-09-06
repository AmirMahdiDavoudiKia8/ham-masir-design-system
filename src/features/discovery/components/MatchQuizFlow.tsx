"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { useMatchQuizStore, type MatchQuizAnswers } from "@/store/matchQuizStore";

interface Step {
  key: keyof MatchQuizAnswers;
  question: string;
  options: string[];
}

const STEPS: Step[] = [
  // Options must match Mentor.track's exact values (see ExamTrackTabs.tsx
  // and the mentor-portal profile form) — filterMentors does an exact
  // string match, so "هنر" here would silently match zero mentors even
  // though "هنر/زبان" mentors exist.
  { key: "track", question: "رشته‌ات چیه؟", options: ["تجربی", "ریاضی", "انسانی", "هنر/زبان"] },
  {
    key: "goal",
    question: "هدفت بیشتر چیه؟",
    options: ["دانشگاه برتر", "رشته‌ی خاص", "دانشگاه و رتبه خاص", "قبولی در هر شرایطی"],
  },
  {
    key: "distraction",
    question: "بیشتر وقتت صرف چی می‌شه بدون این‌که بخوای؟",
    options: ["گوشی و شبکه‌ی اجتماعی", "خواب زیاد", "بازی", "فکر کردن به چیزای دیگه"],
  },
  {
    key: "mainProblem",
    question: "مشکل اصلیت چیه؟",
    options: ["خودِ درس‌خوندن", "انگیزه داشتن", "مدیریت زمان", "تمرکز"],
  },
  { key: "studyTime", question: "ترجیح می‌دی شب درس بخونی یا صبح؟", options: ["شب", "صبح", "هردو، بسته به روز"] },
  { key: "wastedTime", question: "حس کردی وقتتو اشتباه صرف کردی؟", options: ["زیاد", "گاهی", "به‌ندرت", "نه"] },
];

type Answers = Partial<MatchQuizAnswers>;

/**
 * The "چند سؤال کوتاه، یه لیست دقیق" flow off the mentors list
 * (PersonalizedMatchCard) — one question per screen, same shape as
 * OnboardingFlow's quiz phase. `track`, `goal`, `mainProblem`, and
 * `distraction` all drive real filtering on /student/discover (see
 * DiscoveryForm + lib/mentorFilters); `studyTime`/`wastedTime` are only
 * persisted (matchQuizStore) rather than discarded, since no mentor bio
 * addresses either and fabricating a match against them would be dishonest
 * UI. "کدوم پایه‌ای هستی؟" isn't asked here at all — it's already collected
 * during onboarding (see OnboardingFlow's `stage` step) and editable from
 * /student/profile/edit, so asking it twice would just be annoying.
 */
export function MatchQuizFlow() {
  const router = useRouter();
  const setStoredAnswers = useMatchQuizStore((s) => s.setAnswers);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswersState] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);

  const step = STEPS[stepIndex];
  const progress = submitting ? 100 : (stepIndex / STEPS.length) * 100;
  const answer = answers[step.key] ?? "";
  const canProceed = answer.length > 0;
  const isLast = stepIndex === STEPS.length - 1;

  function goBack() {
    if (stepIndex === 0) {
      router.push("/student/discover");
      return;
    }
    setStepIndex((i) => i - 1);
  }

  function goNext() {
    if (!canProceed) return;
    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }
    setSubmitting(true);
    const finalAnswers = { ...answers, [step.key]: answer } as MatchQuizAnswers;
    setStoredAnswers(finalAnswers);
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "quiz", data: finalAnswers }),
    }).catch(() => {});
    router.push(`/student/discover?track=${encodeURIComponent(finalAnswers.track)}`);
  }

  function setAnswer(value: string) {
    setAnswersState((prev) => ({ ...prev, [step.key]: value }));
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-5">
        <button
          type="button"
          onClick={goBack}
          aria-label="بازگشت"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors duration-standard ease-gentle hover:bg-muted active:scale-95"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
        <ProgressBar value={progress} />
      </div>

      <p dir="ltr" className="pt-2 text-center text-caption font-bold text-primary">
        {toPersianDigits(stepIndex + 1)}/{toPersianDigits(STEPS.length)}
      </p>

      <div key={step.key} className="flex flex-col gap-7 px-6 py-10 animate-rise-in">
        <h1 className="text-center text-h1 font-bold text-foreground">{step.question}</h1>

        <div className="grid grid-cols-2 gap-3">
          {step.options.map((option) => {
            const selected = answer === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setAnswer(option)}
                aria-pressed={selected}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2.5 rounded-lg border px-3 py-5 text-center transition-all duration-standard ease-gentle active:scale-[0.97]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selected
                    ? "border-primary bg-gradient-to-l from-primary-hover to-primary text-primary-foreground shadow-brand"
                    : "border-border bg-surface text-foreground hover:border-primary-light hover:bg-primary-soft",
                )}
              >
                <span className="text-body font-bold">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-6">
        <Button size="lg" fullWidth disabled={!canProceed || submitting} onClick={goNext}>
          {submitting ? "در حال پیدا کردن هم‌مسیرت…" : isLast ? "نشونم بده" : "بعدی"}
        </Button>
      </div>
    </div>
  );
}
