"use client";

import { useState } from "react";
import { Button } from "@/design-system";
import { Input } from "@/design-system";
import { digitsOnly, normalizePersianText, toPersianDigits } from "@/lib/format";
import { showToast } from "@/lib/toast";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useProfileStore } from "@/store/profileStore";

interface PhoneAuthGateProps {
  onVerified: (name: string, phone: string) => void;
}

type Phase = "phone" | "login" | "register";

/**
 * Phone + password auth for the student side — same shape as the mentor
 * portal's own accounts (see lib/mentorPortal.ts / mentor register+login
 * pages). Real OTP isn't wired up (no eNamad-approved gateway yet), so this
 * is the whole auth model: phone is the id, password proves it's really that
 * student on repeat visits. Replaces the earlier phone+name interim scheme.
 */
/**
 * The profile-edit screen's extra fields (major, city, intake-quiz answers)
 * live only in localStorage until saved — "خروج از حساب" deliberately
 * clears that (see profileStore/onboardingStore's logout/clearAnswers doc
 * comments, meant for a shared device), which otherwise makes a returning
 * student's own saved answers look permanently lost on re-login. Restoring
 * from the server-side copy (see lib/studentProfiles.ts) here, once, right
 * after a successful login, fixes that without every PhoneAuthGate caller
 * (onboarding, booking, profile tab) needing to duplicate this.
 */
async function restoreStudentProfile(phone: string) {
  try {
    const res = await fetch(`/api/student-profile?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    if (!data.ok || !data.profile) return;
    useProfileStore.getState().updateProfile({
      fieldOfStudy: data.profile.fieldOfStudy ?? "",
      city: data.profile.city ?? "",
    });
    useOnboardingStore.getState().setAnswers({
      stage: data.profile.stage ?? "",
      goal: data.profile.goal ?? "",
      need: data.profile.need ?? "",
      contact: data.profile.contact ?? "",
    });
  } catch {
    // Best-effort — a returning student who hasn't saved these fields
    // before, or a transient network hiccup, shouldn't block login itself.
  }
}

export function PhoneAuthGate({ onVerified }: PhoneAuthGateProps) {
  const [phase, setPhase] = useState<Phase>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmitPhone = /^09\d{9}$/.test(phone.trim());
  const canSubmitLogin = password.length > 0;
  // Compared through normalizePersianText, not a raw === — see its doc
  // comment: two password fields that look identical can carry different
  // Unicode codepoints (Arabic vs Persian ی/ک, a stray zero-width char from
  // a mobile keyboard), which would otherwise leave "ثبت‌نام" permanently
  // disabled with no visible reason.
  const passwordsMatch = normalizePersianText(password) === normalizePersianText(confirmPassword);
  const canSubmitRegister = name.trim().length > 1 && password.length >= 4 && passwordsMatch;

  async function handlePhoneSubmit() {
    if (!canSubmitPhone || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/student-identity?phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      setPhase(data.ok && data.known ? "login" : "register");
    } catch {
      setError("مشکلی پیش اومد، دوباره امتحان کن.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLoginSubmit() {
    if (!canSubmitLogin || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/student-identity/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError("رمز عبور اشتباهه.");
        return;
      }
      await restoreStudentProfile(phone.trim());
      showToast("خوش برگشتی!", "success");
      onVerified(data.name, phone.trim());
    } catch {
      setError("مشکلی پیش اومد، دوباره امتحان کن.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegisterSubmit() {
    if (!canSubmitRegister || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/student-identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), name: name.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError("این شماره همین الان ثبت‌نام شد، صفحه رو تازه کن.");
        return;
      }
      // Registration-only, fires exactly once per new account regardless of
      // which screen the gate was reached from (booking, profile,
      // onboarding) — see PaymentForm's own forward for the separate
      // booking-intent signal, which fires on every identity check there,
      // login included.
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "identity", data: { name: data.name, phone: phone.trim() } }),
      }).catch(() => {});
      showToast("خوش اومدی، حسابت ساخته شد! 🎉", "success");
      onVerified(data.name, phone.trim());
    } catch {
      setError("مشکلی پیش اومد، دوباره امتحان کن.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetToPhone() {
    setPhase("phone");
    setPassword("");
    setConfirmPassword("");
    setError(null);
  }

  if (phase === "phone") {
    return (
      <form
        className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-6 py-8"
        onSubmit={(e) => {
          e.preventDefault();
          handlePhoneSubmit();
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-h1 font-bold text-foreground">شماره تماست چیه؟</h1>
          <p className="text-caption text-muted-foreground">با همین شماره وارد حسابت می‌شی یا می‌سازیمش</p>
        </div>

        <Input
          type="tel"
          inputMode="numeric"
          dir="ltr"
          autoFocus
          value={phone}
          onChange={(e) => setPhone(digitsOnly(e.target.value))}
          maxLength={11}
          placeholder="09xxxxxxxxx"
          className="h-14 text-center text-body"
        />

        {error && <p className="text-center text-caption font-semibold text-danger">{error}</p>}

        <Button type="submit" size="lg" fullWidth disabled={!canSubmitPhone || submitting}>
          {submitting ? "در حال بررسی…" : "ادامه"}
        </Button>
      </form>
    );
  }

  if (phase === "login") {
    return (
      <form
        className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-6 py-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleLoginSubmit();
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-h1 font-bold text-foreground">رمز عبورت رو وارد کن</h1>
          <p className="text-caption text-muted-foreground">برای ورود به حسابت</p>
          <p dir="ltr" className="text-label text-muted-foreground">
            {toPersianDigits(phone)}
          </p>
        </div>

        <Input
          type="password"
          dir="ltr"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          className="h-14 text-center text-body"
        />

        {error && <p className="text-center text-caption font-semibold text-danger">{error}</p>}

        <div className="flex flex-col gap-3">
          <Button type="submit" size="lg" fullWidth disabled={!canSubmitLogin || submitting}>
            {submitting ? "در حال بررسی…" : "ورود"}
          </Button>
          <button
            type="button"
            onClick={resetToPhone}
            className="cursor-pointer text-center text-caption font-semibold text-primary"
          >
            شماره‌ی دیگه‌ای وارد کنم
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-6 py-8"
      onSubmit={(e) => {
        e.preventDefault();
        handleRegisterSubmit();
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-h1 font-bold text-foreground">حساب رو بساز</h1>
        <p className="text-caption text-muted-foreground">اسمت و یه رمز برای خودت انتخاب کن</p>
        <p dir="ltr" className="text-label text-muted-foreground">
          {toPersianDigits(phone)}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم و فامیل"
          className="h-14 text-center text-body"
        />
        <Input
          type="password"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          className="h-14 text-center text-body"
        />
        <Input
          type="password"
          dir="ltr"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="تکرار رمز عبور"
          className="h-14 text-center text-body"
        />
      </div>

      {password.length > 0 && password.length < 4 && (
        <p className="text-center text-caption font-semibold text-danger">رمز باید حداقل ۴ کاراکتر باشه.</p>
      )}
      {password.length >= 4 && confirmPassword.length > 0 && !passwordsMatch && (
        <p className="text-center text-caption font-semibold text-danger">
          تکرار رمز با رمز یکی نیست — اگه مطمئنی یکی نوشتی، صفحه‌کلید فارسی/عربی رو چک کن.
        </p>
      )}
      {error && <p className="text-center text-caption font-semibold text-danger">{error}</p>}

      <div className="flex flex-col gap-3">
        <Button type="submit" size="lg" fullWidth disabled={!canSubmitRegister || submitting}>
          {submitting ? "در حال ساخت حساب…" : "ثبت‌نام"}
        </Button>
        <button
          type="button"
          onClick={resetToPhone}
          className="cursor-pointer text-center text-caption font-semibold text-primary"
        >
          شماره‌ی دیگه‌ای وارد کنم
        </button>
      </div>
    </form>
  );
}
