"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { digitsOnly } from "@/lib/format";
import { loginMentor } from "./actions";

/** Phone + password login for the mentor portal — see lib/mentorPortal.ts for the no-real-security caveat. */
export default function MentorPortalLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    startTransition(async () => {
      const result = await loginMentor(phone, password);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6">
      <div className="flex flex-col items-center gap-3 text-center animate-rise-in">
        <Image src="/brand/logo.png" alt="هم‌مسیر" width={56} height={56} className="h-14 w-14 object-contain" />
        <div>
          <h1 className="text-h1 font-bold text-foreground">ورود منتور</h1>
          <p className="mt-1 text-caption text-muted-foreground">شماره موبایل و رمزی که خودت انتخاب کردی رو وارد کن</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3 animate-rise-in">
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
        <Input
          type="password"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          className="h-14 text-center text-body"
        />
        {error && <p className="text-center text-caption font-semibold text-danger">{error}</p>}
        <Button type="submit" size="lg" fullWidth disabled={!phone.trim() || !password.trim() || isPending}>
          {isPending ? "در حال ورود…" : "ورود"}
        </Button>
        <Link
          href="/mentor/portal/register"
          className="text-center text-caption font-semibold text-primary"
        >
          حساب نداری؟ ثبت‌نام کن
        </Link>
      </form>
    </div>
  );
}
