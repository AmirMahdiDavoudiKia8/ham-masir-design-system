"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { Mentor } from "@/lib/mentors";
import { PLAN_META, getPlanPrice, type PlanKey } from "@/lib/plans";
import { PlanOption } from "./PlanOption";

interface MentorPlansProps {
  mentor: Mentor;
  /** The results-list query string carried in from the mentor card, forwarded on so the booking flow's own back button still returns to the exact results the student searched. */
  back?: string;
}

/**
 * The primary conversion point now that the booking sheet is gone: the two
 * verbatim-titled plans with equal visual weight, single-select, then a
 * CTA that says exactly what it does (canon A.5) into the existing
 * time -> payment -> confirmation flow — reused, not duplicated.
 *
 * A calm sticky bar mirrors the same CTA once the student has scrolled past
 * this section, so a long read doesn't strand the action off-screen. It's a
 * convenience for reaching a choice already made, not an urgency device —
 * no motion beyond a quiet fade-in, no "come back" nagging.
 */
export function MentorPlans({ mentor, back }: MentorPlansProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("session");
  const [pastSection, setPastSection] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastSection(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function goToBooking() {
    const params = new URLSearchParams({ plan: selectedPlan });
    if (back) params.set("back", back);
    router.push(`/student/booking/${mentor.id}?${params.toString()}`);
  }

  const price = getPlanPrice(mentor, selectedPlan);

  return (
    <div ref={sectionRef} className="flex flex-col gap-4">
      <h2 className="text-h2 font-bold text-foreground">پلن‌ها</h2>

      <div className="flex flex-col gap-3">
        <PlanOption
          title={PLAN_META.session.title}
          subtitle={PLAN_META.session.subtitle}
          price={mentor.sessionPrice}
          note="نگران نباش، اگه از جلسه‌ت راضی نبودی، یه جلسه‌ی رایگان دیگه بهت تعلق می‌گیره."
          selected={selectedPlan === "session"}
          onClick={() => setSelectedPlan("session")}
        />
        <PlanOption
          title={PLAN_META.subscription.title}
          subtitle={PLAN_META.subscription.subtitle}
          price={mentor.subscriptionPrice}
          selected={selectedPlan === "subscription"}
          onClick={() => setSelectedPlan("subscription")}
        />
      </div>

      <Button size="lg" fullWidth onClick={goToBooking}>
        ادامه به انتخاب زمان
      </Button>

      {pastSection && (
        <div className="animate-rise-in fixed inset-x-0 bottom-20 z-10 px-4">
          <div className="mx-auto flex max-w-md items-center gap-3 rounded-lg border border-border bg-surface/95 p-3 shadow-lifted backdrop-blur-md">
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption text-muted-foreground">{PLAN_META[selectedPlan].title}</p>
              {price && <p className="truncate text-caption font-bold text-primary">{price}</p>}
            </div>
            <Button onClick={goToBooking} className="shrink-0">
              ادامه به انتخاب زمان
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
