"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PhoneStep } from "@/features/auth/components/PhoneStep";
import { normalizePersianText } from "@/lib/format";
import { registerMentor } from "./actions";

type Phase = "phone" | "details";

/**
 * Self-service account creation for the mentor portal: phone -> name/password.
 * No OTP step — same reasoning as the student-facing phone+name gate (see
 * PhoneAuthGate's doc comment): real SMS verification isn't wired up yet, so
 * a fake "any 4-digit code" step added nothing but friction. Phone
 * uniqueness is still enforced server-side (see actions.ts). On success the
 * mentor is logged in immediately and sent to /mentor/portal/profile to
 * upload a photo/bio/voice intro before their listing goes live for students
 * (see lib/mentorPortal.ts, lib/mentors.ts).
 */
export default function MentorPortalRegisterPage() {
  const [phase, setPhase] = useState<Phase>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  // Compared through normalizePersianText, not a raw ===: two password
  // fields that read as identical to the eye can carry different Unicode
  // codepoints (Arabic vs Persian keyboard variants of ی/ک, or a stray
  // zero-width character a mobile keyboard inserted) — without this, the
  // button below stays permanently disabled with no visible reason, since
  // nothing here or on submit ever explains *why* the passwords "don't
  // match" when the mentor is certain they typed the same thing twice.
  const passwordsMatch = normalizePersianText(password) === normalizePersianText(confirmPassword);
  const canSubmit = name.trim().length > 0 && password.length >= 4 && passwordsMatch;

  function goBack() {
    if (phase === "phone") return;
    setPhase("phone");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    startTransition(async () => {
      const result = await registerMentor({ name, phone, password });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {phase !== "phone" && (
        <header className="flex h-14 items-center px-2">
          <button
            type="button"
            onClick={goBack}
            aria-label="بازگشت"
            className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors duration-standard ease-gentle hover:bg-muted active:scale-95"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </header>
      )}

      {phase === "phone" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-16 animate-rise-in">
          <div className="flex flex-col items-center gap-3 text-center">
            <Image src="/brand/logo.png" alt="هم‌مسیر" width={64} height={64} className="h-16 w-16 object-contain" />
            <div>
              <h1 className="text-h1 font-bold text-foreground">ثبت‌نام منتور</h1>
              <p className="mt-1 text-caption text-muted-foreground">شماره موبایلت رو وارد کن</p>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <PhoneStep phone={phone} onChangePhone={setPhone} onSubmit={() => setPhase("details")} />
          </div>
        </div>
      )}

      {phase === "details" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-8 animate-rise-in">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-h1 font-bold text-foreground">حساب رو تکمیل کن</h1>
            <p className="text-caption text-muted-foreground">اسمت و یه رمز برای خودت انتخاب کن</p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم و فامیل"
              className="h-14 text-center text-body"
              autoFocus
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
            {password.length > 0 && password.length < 4 && (
              <p className="text-center text-caption font-semibold text-danger">رمز باید حداقل ۴ کاراکتر باشه.</p>
            )}
            {password.length >= 4 && confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-center text-caption font-semibold text-danger">
                تکرار رمز با رمز یکی نیست — اگه مطمئنی یکی نوشتی، صفحه‌کلید فارسی/عربی رو چک کن.
              </p>
            )}
            {error && <p className="text-center text-caption font-semibold text-danger">{error}</p>}
            <Button type="submit" size="lg" fullWidth disabled={!canSubmit || isPending}>
              {isPending ? "در حال ثبت‌نام…" : "ثبت‌نام"}
            </Button>
          </form>
        </div>
      )}

      {phase === "phone" && (
        <div className="px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] text-center">
          <Link href="/mentor/portal/login" className="text-caption font-semibold text-primary">
            قبلاً ثبت‌نام کردی؟ وارد شو
          </Link>
        </div>
      )}
    </div>
  );
}
