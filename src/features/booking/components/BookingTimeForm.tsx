"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { RepeatIcon } from "@/components/ui/icons";
import type { Mentor } from "@/lib/mentors";
import type { PlanKey } from "@/lib/plans";
import { getMentorSlots } from "@/lib/slots";
import { BookingSummaryCard } from "./BookingSummaryCard";
import { TimeSlotOption } from "./TimeSlotOption";

interface BookingTimeFormProps {
  mentor: Mentor;
  plan: PlanKey;
}

/**
 * Screen A: the student proposes a time — this is request-based scheduling,
 * not a live calendar, so slots are plain labels the mentor later confirms
 * (or counters) elsewhere. Selection is local state; submitting hands off to
 * the payment screen via the URL, the same way DiscoveryForm hands off to
 * the mentors list.
 */
export function BookingTimeForm({ mentor, plan }: BookingTimeFormProps) {
  const router = useRouter();
  const slots = getMentorSlots(mentor);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  function handleSubmit() {
    if (!selectedSlot) return;
    const params = new URLSearchParams({ plan, slot: selectedSlot });
    router.push(`/student/booking/${mentor.id}/payment?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <BookingSummaryCard mentor={mentor} plan={plan} />

      <div className="flex flex-col gap-2.5">
        <h2 className="text-label font-medium text-foreground">چه زمانی برات خوبه؟</h2>
        <p className="text-caption text-muted-foreground">
          یه بازه زمانی که برات مناسبه رو انتخاب کن. پشتیبانی با یک تماس از تایم دقیق جلسه باخبرت می‌کنه.
        </p>
        <div className="flex flex-col gap-2.5">
          {slots.map((slot) => (
            <TimeSlotOption
              key={slot}
              label={slot}
              selected={selectedSlot === slot}
              onClick={() => setSelectedSlot(slot)}
            />
          ))}
        </div>
      </div>

      {plan === "subscription" && (
        <div className="flex items-start gap-2.5 rounded-md bg-surface-alt px-4 py-3.5">
          <RepeatIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-muted-foreground" />
          <p className="text-caption text-muted-foreground">
            این اولین جلسه‌ی هفتگیته. برنامه هرماه تمدید می‌شه و هر وقت بخوای، قبل از شروع دوره‌ی بعد می‌تونی لغوش
            کنی.
          </p>
        </div>
      )}

      <Button size="lg" fullWidth disabled={!selectedSlot} onClick={handleSubmit}>
        ادامه به پرداخت
      </Button>
    </div>
  );
}
