"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { PlannerFormData, PlannerResult } from "../../types";
import { getTrendProjection } from "../../explanations";
import { AllocationBarChart } from "./AllocationBarChart";
import { AllocationTable } from "./AllocationTable";
import { CtaSection } from "./CtaSection";
import { HeroSummary } from "./HeroSummary";
import { HourRampChart } from "./HourRampChart";
import { JamBandiBox } from "./JamBandiBox";
import { RadarChart } from "./RadarChart";
import { StrengthWeaknessCard } from "./StrengthWeaknessCard";

interface ResultPageProps {
  formData: PlannerFormData;
  result: PlannerResult;
}

const FINAL_STRETCH_DAYS = 30;

/** Assembles result-page sections A-H per the planner spec, each entrance-staggered via animate-rise-in + an increasing delay. */
export function ResultPage({ formData, result }: ResultPageProps) {
  const showJamBandiBox = result.daysLeft < FINAL_STRETCH_DAYS;
  let sectionIndex = 0;
  const nextDelay = () => `${sectionIndex++ * 70}ms`;

  return (
    <div className="flex flex-col gap-5 px-4 pb-10 pt-4">
      <header className="flex items-center gap-1">
        <Link
          href="/student/home"
          aria-label="بازگشت"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors duration-standard ease-gentle hover:bg-muted active:scale-95"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </header>

      <div style={{ animationDelay: nextDelay() }} className="animate-rise-in">
        <HeroSummary formData={formData} result={result} />
      </div>

      <Section title="تعادل درس‌هات" delay={nextDelay()}>
        <RadarChart allocations={result.subjectAllocations} />
      </Section>

      <Section title="نقاط قوت و رشد" delay={nextDelay()}>
        <StrengthWeaknessCard allocations={result.subjectAllocations} />
      </Section>

      <Section title="تخصیص ساعت هفتگی" delay={nextDelay()}>
        <AllocationBarChart allocations={result.subjectAllocations} />
      </Section>

      <Section title="مسیر رشد ساعت مطالعه تا کنکور" delay={nextDelay()}>
        <HourRampChart points={result.hourRampCurve} />
        <p className="text-caption leading-6 text-muted-foreground">{getTrendProjection(result.phase, result.overallGapPercent)}</p>
      </Section>

      <Section title="جدول کامل تخصیص" delay={nextDelay()}>
        <AllocationTable allocations={result.subjectAllocations} subjects={formData.subjects} />
      </Section>

      {showJamBandiBox && (
        <div style={{ animationDelay: nextDelay() }} className="animate-rise-in">
          <JamBandiBox />
        </div>
      )}

      <div style={{ animationDelay: nextDelay() }} className="animate-rise-in">
        <CtaSection formData={formData} />
      </div>
    </div>
  );
}

function Section({ title, delay, children }: { title: string; delay: string; children: ReactNode }) {
  return (
    <section
      style={{ animationDelay: delay }}
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-card animate-rise-in"
    >
      <h2 className="text-h3 font-bold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
