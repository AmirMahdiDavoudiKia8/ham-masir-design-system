"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ArrowRightIcon } from "@/components/ui/icons";
import { toPersianDigits } from "@/lib/format";
import { usePlannerResultStore } from "@/store/plannerResultStore";
import { LoadingTransition } from "./components/LoadingTransition";
import { StepBasicInfo, isStepBasicInfoValid } from "./components/StepBasicInfo";
import { StepCurrentStatus, isStepCurrentStatusValid } from "./components/StepCurrentStatus";
import { StepFinal, isStepFinalValid } from "./components/StepFinal";
import { StepGoal, isStepGoalValid } from "./components/StepGoal";
import { StepHabits, isStepHabitsValid } from "./components/StepHabits";
import { StepSubjectRating, isStepSubjectRatingValid } from "./components/StepSubjectRating";
import { ResultPage } from "./components/result/ResultPage";
import { computePlannerResult } from "./engine";
import { buildPlannerLeadPayload } from "./leadPayload";
import type { PlannerFormData } from "./types";

type DraftData = Partial<PlannerFormData>;
type FlowPhase = "form" | "loading" | "result";

interface StepDef {
  Component: (props: { data: DraftData; onChange: (update: Partial<PlannerFormData>) => void }) => React.ReactNode;
  isValid: (data: DraftData) => boolean;
}

interface PageDef {
  title: string;
  steps: StepDef[];
}

/** All 6 original steps collapsed into 2 scrollable pages, per request — order of questions inside each page is unchanged from the original step order. */
const PAGES: PageDef[] = [
  {
    title: "درباره‌ی خودت و هدفت",
    steps: [
      { Component: StepBasicInfo, isValid: isStepBasicInfoValid },
      { Component: StepGoal, isValid: isStepGoalValid },
      { Component: StepCurrentStatus, isValid: isStepCurrentStatusValid },
    ],
  },
  {
    title: "خودارزیابی و عادت‌های مطالعه",
    steps: [
      { Component: StepSubjectRating, isValid: isStepSubjectRatingValid },
      { Component: StepHabits, isValid: isStepHabitsValid },
      { Component: StepFinal, isValid: isStepFinalValid },
    ],
  },
];

/**
 * The free public "برنامه‌ساز کنکور" diagnostic — a 2-page form (no login
 * required) that hands off to computePlannerResult for the result page.
 * State is plain local useState, same shape as MatchQuizFlow: no persisted
 * store for in-progress answers (v1 doesn't need to survive a refresh — see
 * spec section 9's edge cases list, which explicitly defers this to v1.1;
 * the completed *result*, once reached, is persisted separately — see
 * plannerResultStore.ts).
 */
export function PlannerFlow() {
  const router = useRouter();
  const savedFormData = usePlannerResultStore((s) => s.formData);
  const setSavedFormData = usePlannerResultStore((s) => s.setFormData);
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState<DraftData>({ subjects: [], interestedFields: [], mainChallenges: [] });
  const [phase, setPhase] = useState<FlowPhase>("form");

  // Zustand's persist middleware hydrates from sessionStorage asynchronously
  // after this component's first render (same gotcha as matchQuizStore) —
  // once it resolves, a completed session from earlier in this tab jumps
  // straight to its result instead of restarting the form. See
  // plannerResultStore.ts for why this is the fix for the browser-back
  // button after the CTA navigates away to Discover.
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (hasRestoredRef.current || !savedFormData) return;
    hasRestoredRef.current = true;
    setData(savedFormData);
    setPhase("result");
  }, [savedFormData]);

  const page = PAGES[pageIndex];
  const isLast = pageIndex === PAGES.length - 1;
  const canProceed = page.steps.every((s) => s.isValid(data));
  const progress = (pageIndex / PAGES.length) * 100;

  const result = useMemo(() => {
    if (phase !== "result") return null;
    return computePlannerResult(data as PlannerFormData);
  }, [phase, data]);

  function patch(update: Partial<PlannerFormData>) {
    setData((prev) => ({ ...prev, ...update }));
  }

  function goBack() {
    if (pageIndex === 0) {
      router.push("/student/home");
      return;
    }
    setPageIndex((i) => i - 1);
  }

  function goNext() {
    if (!canProceed) return;
    if (!isLast) {
      setPageIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const finalData = data as PlannerFormData;
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "planner", data: buildPlannerLeadPayload(finalData) }),
    }).catch(() => {});
    setPhase("loading");
  }

  if (phase === "loading") {
    return (
      <LoadingTransition
        onDone={() => {
          setSavedFormData(data as PlannerFormData);
          setPhase("result");
        }}
      />
    );
  }

  if (phase === "result" && result) {
    return <ResultPage formData={data as PlannerFormData} result={result} />;
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
        {toPersianDigits(pageIndex + 1)}/{toPersianDigits(PAGES.length)}
      </p>

      <div key={pageIndex} className="flex flex-col gap-10 px-6 py-8 animate-rise-in">
        <h1 className="text-center text-h2 font-bold text-foreground">{page.title}</h1>
        {page.steps.map(({ Component }, i) => (
          <div key={i} className="flex flex-col gap-8 border-t border-border pt-8 first:border-t-0 first:pt-0">
            <Component data={data} onChange={patch} />
          </div>
        ))}
      </div>

      <div className="px-6 pb-8">
        <Button size="lg" fullWidth disabled={!canProceed} onClick={goNext}>
          {isLast ? "برنامه‌مو بساز" : "بعدی"}
        </Button>
      </div>
    </div>
  );
}
