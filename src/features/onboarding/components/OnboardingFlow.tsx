"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/design-system";
import { ProgressBar } from "@/design-system";
import { Input } from "@/design-system";
import {
  ArrowRightIcon,
  BoltIcon,
  BookIcon,
  CalendarIcon,
  ChatIcon,
  CompassIcon,
  PhoneIcon,
  SparkleIcon,
  VideoIcon,
  type IconProps,
} from "@/design-system";
import { PhoneAuthGate } from "@/features/auth/components/PhoneAuthGate";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { useOnboardingStore, type OnboardingAnswers as StoredOnboardingAnswers } from "@/store/onboardingStore";
import { useProfileStore } from "@/store/profileStore";

/** Durable, phone-keyed copy — same reasoning as ProfileEditForm's own save (see lib/studentProfiles.ts): without this, a student who never visits the edit screen would still lose these answers on "خروج از حساب" + re-login. */
function persistOnboardingAnswers(phone: string, answers: StoredOnboardingAnswers) {
  fetch("/api/student-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone,
      stage: answers.stage,
      goal: answers.goal,
      need: answers.need,
      contact: answers.contact,
    }),
  }).catch(() => {});
}

type Icon = (props: IconProps) => React.JSX.Element;

interface Option {
  key: string;
  label: string;
  Icon?: Icon;
}

interface SingleStep {
  kind: "single";
  key: "stage" | "need" | "contact";
  question: string;
  options: Option[];
}

interface TextStep {
  kind: "text";
  key: "goal";
  question: string;
  placeholder: string;
}

type Step = SingleStep | TextStep;

const STEPS: Step[] = [
  {
    kind: "single",
    key: "stage",
    question: "الان کجای مسیر هستی؟",
    options: [
      { key: "دهم", label: "دهم" },
      { key: "یازدهم", label: "یازدهم" },
      { key: "دوازدهم", label: "دوازدهم" },
      { key: "پشت‌کنکوری", label: "پشت‌کنکوری" },
    ],
  },
  {
    kind: "text",
    key: "goal",
    question: "دوست داری به کجا برسی؟",
    placeholder: "پزشکی دانشگاه تهران",
  },
  {
    kind: "single",
    key: "need",
    question: "بیشتر در چه چیزی به همراهی نیاز داری؟",
    options: [
      { key: "study", label: "نحوه مطالعه دروس", Icon: BookIcon },
      { key: "motivation", label: "انگیزه و تمرکز", Icon: BoltIcon },
      { key: "planning", label: "برنامه‌ریزی", Icon: CalendarIcon },
      { key: "field", label: "انتخاب رشته", Icon: CompassIcon },
    ],
  },
  {
    kind: "single",
    key: "contact",
    question: "دوست داری چطور با هم‌مسیرت در ارتباط باشی؟",
    options: [
      { key: "chat", label: "چت", Icon: ChatIcon },
      { key: "video", label: "تماس تصویری", Icon: VideoIcon },
      { key: "call", label: "تماس تلفنی", Icon: PhoneIcon },
      { key: "any", label: "فرقی نداره", Icon: SparkleIcon },
    ],
  },
];

type Answers = Partial<Record<Step["key"], string>>;

type Phase = "identity" | "quiz";

/** Identity (phone+name) counts as a step too, same as the mentor-application flow — the quiz is only the last leg of this progress bar, not the whole thing. */
const TOTAL_STEPS = 1 + STEPS.length;

/**
 * Identity verification (see features/auth/PhoneAuthGate — phone+password,
 * the stand-in for real OTP) followed by the four-question intake quiz, gating
 * /student/home. Verifying writes name+phone to profileStore, same as every
 * other identity-capture point, so a student who's onboarded doesn't hit
 * the phone gate again on the profile tab. The quiz answers themselves are
 * persisted separately (see onboardingStore) once the quiz completes, so
 * the edit-profile screen can show and let the student revise them later —
 * they're what seeds the profile-completion gauge's starting 50%.
 */
export function OnboardingFlow() {
  const router = useRouter();
  const setStoredAnswers = useOnboardingStore((s) => s.setAnswers);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [phase, setPhase] = useState<Phase>("identity");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);

  const step = STEPS[stepIndex];
  const globalIndex = phase === "identity" ? 0 : 1 + stepIndex;
  // Starts empty and fills with each *answered* step, not the one currently on screen.
  const progress = submitting ? 100 : (globalIndex / TOTAL_STEPS) * 100;
  const answer = answers[step.key] ?? "";
  const canProceed = answer.trim().length > 0;
  const isLast = stepIndex === STEPS.length - 1;

  function handleIdentityVerified(name: string, phone: string) {
    updateProfile({ name, phone });
    setPhase("quiz");
  }

  function goBack() {
    if (phase === "identity") {
      router.push("/student/home");
      return;
    }
    if (stepIndex === 0) {
      setPhase("identity");
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
    // Single-select answers are stored by their machine `key` (e.g.
    // "chat"); resolve each to its display label before persisting so the
    // profile screen can show the actual Persian answer, not the raw key.
    const finalAnswers = { ...answers, [step.key]: answer };
    const resolved = STEPS.reduce((acc, s) => {
      const raw = finalAnswers[s.key] ?? "";
      acc[s.key] = s.kind === "single" ? (s.options.find((o) => o.key === raw)?.label ?? raw) : raw;
      return acc;
    }, {} as StoredOnboardingAnswers);
    setStoredAnswers(resolved);
    const phone = useProfileStore.getState().profile.phone;
    if (phone) persistOnboardingAnswers(phone, resolved);
    router.push("/student/home");
  }

  function setAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [step.key]: value }));
  }

  return (
    <div className="flex min-h-dvh flex-col">
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
        {toPersianDigits(globalIndex + 1)}/{toPersianDigits(TOTAL_STEPS)}
      </p>

      {phase === "identity" && (
        <div className="flex flex-1 flex-col animate-rise-in">
          <PhoneAuthGate onVerified={handleIdentityVerified} />
        </div>
      )}

      {phase === "quiz" && (
        <>
          <p className="px-6 pt-3 text-center text-caption font-semibold text-muted-foreground">
            فقط چند سوال کوچیک تا پیدا کردن بهترین هم‌مسیر برای تو
          </p>

          <div key={step.key} className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-7 px-6 py-8 animate-rise-in">
            <h1 className="text-center text-h1 font-bold text-foreground">{step.question}</h1>

            {step.kind === "single" ? (
              <div className="grid grid-cols-2 gap-3">
                {step.options.map(({ key, label, Icon }) => {
                  const selected = answer === key;
                  return (
                    <OptionCard key={key} selected={selected} onClick={() => setAnswer(key)}>
                      {Icon && (
                        <span
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-full",
                            selected ? "bg-white/15" : "bg-secondary-soft text-secondary-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                      )}
                      <span className="text-body font-bold">{label}</span>
                    </OptionCard>
                  );
                })}
              </div>
            ) : (
              <Input
                autoFocus
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={step.placeholder}
                className="h-14 text-center text-body"
              />
            )}
          </div>

          <div className="px-6 pb-[calc(env(safe-area-inset-bottom)+24px)]">
            <Button size="lg" fullWidth disabled={!canProceed || submitting} onClick={goNext}>
              {submitting ? "در حال پیدا کردن هم‌مسیرت…" : isLast ? "پیدا کن!" : "بعدی"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2.5 rounded-lg border px-3 py-5 text-center transition-all duration-standard ease-gentle active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-primary bg-gradient-to-l from-primary-hover to-primary text-primary-foreground shadow-brand"
          : "border-border bg-surface text-foreground hover:border-primary-light hover:bg-primary-soft",
      )}
    >
      {children}
    </button>
  );
}
