"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { digitsOnly } from "@/lib/format";
import { useMatchQuizStore } from "@/store/matchQuizStore";
import { TRACK_LABEL_FA } from "../../constants";
import { buildPlannerLeadPayload } from "../../leadPayload";
import type { GoalTier, PlannerFormData } from "../../types";

interface CtaSectionProps {
  formData: PlannerFormData;
}

/**
 * Maps the planner's 5 goal tiers onto the two goal strings
 * matchQuizStore.goalToRankFilter already recognizes ("دانشگاه برتر" ->
 * rankMax 999, "قبولی در هر شرایطی" -> rankMin 1000), so writing into the
 * store below actually pre-filters /student/discover by mentor rank — same
 * mechanism MatchQuizFlow itself relies on, not just a cosmetic query param
 * (see store/matchQuizStore.ts and DiscoveryForm.tsx's `quizRank` usage).
 */
function goalTierToQuizGoal(goalTier: GoalTier): string {
  if (goalTier === "top200" || goalTier === "under1000" || goalTier === "under3000") return "دانشگاه برتر";
  return "قبولی در هر شرایطی";
}

function postLead(data: Record<string, string>) {
  fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "planner", data }),
  }).catch(() => {});
}

/** Section H — the marketing conversion point: reserve a هم‌مسیر (real filtering handoff to Discover) or leave a phone number for the PDF, both optional and never blocking the result itself. */
export function CtaSection({ formData }: CtaSectionProps) {
  const router = useRouter();
  const setQuizAnswers = useMatchQuizStore((s) => s.setAnswers);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const canSubmitPhone = /^09\d{9}$/.test(phone.trim());

  function goToDiscover() {
    const trackLabel = TRACK_LABEL_FA[formData.track];
    setQuizAnswers({
      track: trackLabel,
      goal: goalTierToQuizGoal(formData.goalTier),
      distraction: "",
      mainProblem: "",
      studyTime: "",
      wastedTime: "",
    });
    // Same reasoning as submitPhone below: carry the complete answer set,
    // not just track/goalTier — this is the more-clicked of the two CTA
    // buttons, so leaving it as a 3-field fragment (as it was before) meant
    // most planner leads in the admin view showed none of the actual
    // diagnostic answers.
    postLead(buildPlannerLeadPayload(formData, { stage: "cta_discover_click" }));
    router.push(`/student/discover?track=${encodeURIComponent(trackLabel)}`);
  }

  function submitPhone() {
    if (!canSubmitPhone) return;
    // Carries the *complete* answer set alongside the phone number, not just
    // track/goalTier — so this one record is self-contained instead of a
    // phone-only fragment an admin can't connect back to the rest of the
    // diagnostic (see leadPayload.ts's doc comment).
    postLead(buildPlannerLeadPayload(formData, { stage: "pdf_request", phone: phone.trim() }));
    setSent(true);
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-primary/30 bg-gradient-to-b from-primary-soft to-surface p-6 text-center">
      <p className="text-body leading-8 text-foreground">
        این یه نقشه‌ی کلیه. یه هم‌مسیر که خودش این مسیر رو رفته، هر ۲ هفته این برنامه رو باهات دقیق و به‌روز می‌کنه.
      </p>

      <Button size="lg" fullWidth onClick={goToDiscover}>
        هم‌مسیرم رو پیدا کن
      </Button>

      {!showPhoneInput && !sent && (
        <button
          type="button"
          onClick={() => setShowPhoneInput(true)}
          className="text-caption font-semibold text-muted-foreground underline-offset-2 hover:underline"
        >
          فقط PDF نتیجه رو برام بفرست
        </button>
      )}

      {showPhoneInput && !sent && (
        <div className="flex flex-col gap-2.5 pt-1">
          <Input
            type="tel"
            inputMode="numeric"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(digitsOnly(e.target.value))}
            maxLength={11}
            placeholder="09xxxxxxxxx"
            className="text-center"
          />
          <Button variant="outline-brand" fullWidth disabled={!canSubmitPhone} onClick={submitPhone}>
            بفرست برام
          </Button>
        </div>
      )}

      {sent && <p className="text-caption font-semibold text-primary">ثبت شد — به‌زودی باهات تماس می‌گیریم.</p>}
    </div>
  );
}
