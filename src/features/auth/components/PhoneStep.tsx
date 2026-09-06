"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { digitsOnly } from "@/lib/format";

interface PhoneStepProps {
  phone: string;
  onChangePhone: (phone: string) => void;
  onSubmit: () => void;
}

/** Phone-number entry step. Used by the mentor registration flow — no real SMS gateway is wired up, so this just collects the number rather than "sending a code" (see PhoneAuthGate for the equivalent student-side reasoning). */
export function PhoneStep({ phone, onChangePhone, onSubmit }: PhoneStepProps) {
  const canSubmit = /^09\d{9}$/.test(phone.trim());

  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-6 py-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-h1 font-bold text-foreground">شماره تماست چیه؟</h1>
        <p className="text-caption text-muted-foreground">با همین شماره حسابت رو می‌سازیم</p>
      </div>

      <Input
        type="tel"
        inputMode="numeric"
        dir="ltr"
        autoFocus
        value={phone}
        onChange={(e) => onChangePhone(digitsOnly(e.target.value))}
        maxLength={11}
        placeholder="09xxxxxxxxx"
        className="h-14 text-center text-body"
      />

      <Button type="submit" size="lg" fullWidth disabled={!canSubmit}>
        ادامه
      </Button>
    </form>
  );
}
