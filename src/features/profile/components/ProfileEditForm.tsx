"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { MentorAvatar } from "@/features/mentors/components/MentorAvatar";
import { digitsOnly } from "@/lib/format";
import { useOnboardingStore, type OnboardingAnswers } from "@/store/onboardingStore";
import { useProfileStore, type StudentProfile } from "@/store/profileStore";

const FIELDS_OF_STUDY = ["ریاضی", "تجربی", "انسانی", "هنر"];
const STAGES = ["دهم", "یازدهم", "دوازدهم", "پشت‌کنکوری"];
const NEEDS = ["نحوه مطالعه دروس", "انگیزه و تمرکز", "برنامه‌ریزی", "انتخاب رشته"];

/**
 * Local draft state, written back to the stores only on "ذخیره تغییرات" —
 * matches OnboardingFlow/PaymentForm, where nothing touches persisted state
 * until the step actually completes. Covers two stores: profileStore for
 * fields collected here, and onboardingStore for the intake-quiz answers —
 * editable here since they're no longer locked (see OnboardingFlow).
 */
export function ProfileEditForm() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const onboardingAnswers = useOnboardingStore((s) => s.answers);
  const setOnboardingAnswers = useOnboardingStore((s) => s.setAnswers);
  const [form, setForm] = useState<StudentProfile>(profile);
  const [answers, setAnswers] = useState<OnboardingAnswers>(onboardingAnswers);

  // Zustand's persist middleware hydrates from localStorage asynchronously,
  // after this component's first render — a direct/fresh load of this page
  // (bookmark, refresh, new tab) can mount with `profile` still at its empty
  // default, and useState's initial value only ever captures that one snapshot.
  // Re-sync once, the moment real persisted data shows up, so a save right
  // after landing here doesn't wipe out this student's name/phone with blanks.
  const hasSyncedRef = useRef(false);
  useEffect(() => {
    if (!hasSyncedRef.current && profile.phone) {
      hasSyncedRef.current = true;
      setForm(profile);
      setAnswers(onboardingAnswers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  function handleSave() {
    updateProfile(form);
    setOnboardingAnswers(answers);
    // Same "identity" lead type as registration (see PhoneAuthGate) — the
    // Apps Script matches by phone and fills these columns into that
    // student's existing row instead of appending a new one.
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "identity",
        data: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          stage: answers.stage ?? "",
          fieldOfStudy: form.fieldOfStudy ?? "",
          goal: answers.goal ?? "",
          need: answers.need ?? "",
          city: form.city ?? "",
        },
      }),
    }).catch(() => {});
    // Durable, phone-keyed copy — what makes these fields survive "خروج از
    // حساب" + logging back in, instead of only living in this browser's
    // localStorage (see lib/studentProfiles.ts).
    fetch("/api/student-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: form.phone.trim(),
        fieldOfStudy: form.fieldOfStudy ?? "",
        city: form.city ?? "",
        stage: answers.stage ?? "",
        goal: answers.goal ?? "",
        need: answers.need ?? "",
        contact: answers.contact ?? "",
      }),
    }).catch(() => {});
    router.push("/student/profile");
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-6 animate-rise-in">
      <div className="flex flex-col items-center gap-3">
        <MentorAvatar photo={form.avatar || undefined} name={form.name} size={96} />
      </div>

      <Field label="نام و نام‌خانوادگی">
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="مثلاً سارا احمدی"
        />
      </Field>

      <Field label="شماره موبایل">
        <Input
          type="tel"
          inputMode="numeric"
          dir="ltr"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: digitsOnly(e.target.value) }))}
          maxLength={11}
          placeholder="09xxxxxxxxx"
          className="text-center"
        />
      </Field>

      <Field label="مقطع تحصیلی">
        <div className="flex flex-wrap gap-2">
          {STAGES.map((stage) => (
            <Chip key={stage} selected={answers.stage === stage} onClick={() => setAnswers((a) => ({ ...a, stage }))}>
              {stage}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="رشته">
        <div className="flex flex-wrap gap-2">
          {FIELDS_OF_STUDY.map((fieldOfStudy) => (
            <Chip
              key={fieldOfStudy}
              selected={form.fieldOfStudy === fieldOfStudy}
              onClick={() => setForm((f) => ({ ...f, fieldOfStudy }))}
            >
              {fieldOfStudy}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="هدفت چیه؟">
        <Input
          value={answers.goal}
          onChange={(e) => setAnswers((a) => ({ ...a, goal: e.target.value }))}
          placeholder="پزشکی دانشگاه تهران"
        />
      </Field>

      <Field label="بیشتر در چه چیزی به همراهی نیاز داری؟">
        <div className="flex flex-wrap gap-2">
          {NEEDS.map((need) => (
            <Chip key={need} selected={answers.need === need} onClick={() => setAnswers((a) => ({ ...a, need }))}>
              {need}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="شهر">
        <Input
          value={form.city}
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          placeholder="مثلاً اصفهان"
        />
      </Field>

      <Button size="lg" fullWidth onClick={handleSave}>
        ذخیره تغییرات
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-caption font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
