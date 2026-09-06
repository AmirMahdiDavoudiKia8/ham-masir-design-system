"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckIcon, ClockIcon, LockIcon } from "@/components/ui/icons";
import { PhoneAuthGate } from "@/features/auth/components/PhoneAuthGate";
import { trackClick } from "@/lib/analyticsClient";
import type { Mentor } from "@/lib/mentors";
import { PAYMENT_CARD_NUMBER, PAYMENT_CARD_OWNER } from "@/lib/payment";
import { PLAN_META, getPlanPrice, type PlanKey } from "@/lib/plans";
import { useBookingsStore } from "@/store/bookingsStore";
import { useProfileStore } from "@/store/profileStore";
import { linkSubscriptionToPortal } from "./actions";
import { BookingSummaryCard } from "./BookingSummaryCard";

interface PaymentFormProps {
  mentor: Mentor;
  plan: PlanKey;
  slot: string;
}

type Phase = "identity" | "pay";

/**
 * Screen B0: before a student's very first payment, we don't actually know
 * who they are yet — so this gates the real payment UI behind
 * PhoneAuthGate (features/auth), the phone+password stand-in for real OTP (see
 * that component's doc comment for why). Always starts at "identity" on the
 * very first render (server and client agree, so no hydration mismatch),
 * but a mount effect immediately advances past it to "pay" if profileStore
 * already has a verified name+phone from a previous booking — a returning
 * student never gets re-asked, and a phone number can't end up saved under
 * two different names since there's only ever one profile per device to
 * read from (and the gate itself rejects a name mismatch server-side too).
 *
 * Once verified, name+phone are written to the shared profileStore so the
 * rest of the app (profile screen, completion gauge) picks them up too.
 *
 * Payment itself is card-to-card, entirely manual: this screen creates a
 * pending payment-request record (src/lib/paymentRequests, currently just a
 * log — nothing reads it back yet) for a reference code, shows the card
 * number, and asks the student to send the receipt to Telegram/Bale
 * directly. There's no live channel back to this browser tab, so the
 * booking is still recorded here optimistically; the admin manually
 * following up on the receipt is the real gate on whether the session
 * actually happens (see the Telegram/Bale bot in bots/ for the automated
 * version of this — currently unused because Telegram is filtered in Iran
 * and can't be reached reliably from Iran-hosted infrastructure).
 */
export function PaymentForm({ mentor, plan, slot }: PaymentFormProps) {
  const router = useRouter();
  const bookings = useBookingsStore((s) => s.bookings);
  const addBooking = useBookingsStore((s) => s.addBooking);
  const restoreBookings = useBookingsStore((s) => s.restoreBookings);
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const [phase, setPhase] = useState<Phase>("identity");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [payCode, setPayCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Zustand's persist middleware hydrates profileStore/bookingsStore from
  // localStorage asynchronously, after this component's first render — a
  // direct/fresh load of this screen (bookmark, refresh, coming back from
  // "خانه" mid-flow) could mount with both still at their empty defaults.
  // The original single mount-only effect reacted to that emptiness as "a
  // brand-new visitor", re-showing PhoneAuthGate to an already-verified
  // returning student and failing to restore an in-progress payment. Two
  // separate ref-guarded effects, each keyed on its own store's data
  // actually showing up, fix both independently instead of relying on one
  // mount-time snapshot of both at once.
  const hasSyncedProfileRef = useRef(false);
  useEffect(() => {
    if (hasSyncedProfileRef.current || !profile.name.trim() || !profile.phone.trim()) return;
    hasSyncedProfileRef.current = true;
    setName(profile.name);
    setPhone(profile.phone);
    setPhase("pay");
    fetchAndRestoreBookings(profile.phone.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.name, profile.phone]);

  const hasSyncedPayCodeRef = useRef(false);
  useEffect(() => {
    if (hasSyncedPayCodeRef.current) return;
    const existing = bookings.find((b) => b.mentorId === mentor.id && b.plan === plan && b.slot === slot);
    if (!existing?.payCode) return;
    hasSyncedPayCodeRef.current = true;
    setPayCode(existing.payCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  function fetchAndRestoreBookings(forPhone: string) {
    fetch(`/api/student-bookings?phone=${encodeURIComponent(forPhone)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) restoreBookings(data.bookings);
      })
      .catch(() => {});
  }

  function handleCopyCard() {
    navigator.clipboard
      .writeText(PAYMENT_CARD_NUMBER)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  function handleVerified(verifiedName: string, verifiedPhone: string) {
    setName(verifiedName);
    setPhone(verifiedPhone);
    updateProfile({ name: verifiedName, phone: verifiedPhone });
    fetchAndRestoreBookings(verifiedPhone);
    setPhase("pay");
  }

  async function handlePay() {
    trackClick(`/student/booking/${mentor.id}/payment`, "payment_submit");
    setSubmitting(true);
    try {
      const res = await fetch("/api/payment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          mentorId: mentor.id,
          mentorName: mentor.name ?? "",
          planTitle: PLAN_META[plan].title,
          slot,
          price: getPlanPrice(mentor, plan),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "failed");

      // Fires here (not on identity verification) so it fires for every
      // booking — new student or returning, same device or not — instead
      // of only the first time this browser ever verified an identity.
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          data: {
            name: name.trim(),
            phone: phone.trim(),
            mentorId: mentor.id,
            mentorName: mentor.name ?? "",
            plan: PLAN_META[plan].title,
            slot,
            code: data.code,
          },
        }),
      }).catch(() => {});

      // The server may have kept an earlier name already on file for this
      // phone instead of what was just typed (see lib/studentIdentities) —
      // reflect that back into the local profile so it stays consistent.
      const resolvedName: string = data.name ?? name.trim();
      if (resolvedName !== name.trim()) {
        updateProfile({ name: resolvedName });
      }

      // The moment the payment request is created is the one place a
      // booking gets created — this is what makes it show up correctly in
      // "جلسه‌های من", even though the payment itself is confirmed later in
      // the bot.
      addBooking({
        mentorId: mentor.id,
        plan,
        planTitle: PLAN_META[plan].title,
        slot,
        price: getPlanPrice(mentor, plan),
        status: "upcoming",
        payCode: data.code,
      });
      // Durable, phone-keyed copy — what makes this booking show up again on
      // another device (or this one, after clearing storage) once the same
      // phone is verified. See lib/studentBookings.
      fetch("/api/student-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          mentorId: mentor.id,
          plan,
          planTitle: PLAN_META[plan].title,
          slot,
          price: getPlanPrice(mentor, plan),
          status: "upcoming",
        }),
      }).catch(() => {});
      // Subscription is the only plan with an ongoing weekly plan/progress —
      // this is what links the student's own browser to a real, server-side
      // record the mentor can write a plan into (see lib/mentorPortal.ts).
      if (plan === "subscription") {
        linkSubscriptionToPortal(resolvedName, phone.trim(), mentor.id).catch(() => {});
      }
      setPayCode(data.code);
    } finally {
      setSubmitting(false);
    }
  }

  function handleDone() {
    const params = new URLSearchParams({ plan, slot });
    router.push(`/student/booking/${mentor.id}/confirmation?${params.toString()}`);
  }

  if (payCode) {
    return (
      <div className="flex flex-col gap-6">
        <BookingSummaryCard mentor={mentor} plan={plan} slot={slot} />

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
          <p className="text-body font-bold text-foreground">یه قدم مونده: پرداخت</p>
          <p className="text-caption text-muted-foreground">
            شماره کارت و مبلغ رو زیر می‌بینی — بعد از واریز، رسیدتو بفرست تا تایید بشه.
          </p>
          <p className="text-caption text-muted-foreground">
            کد رزروت: <span dir="ltr" className="font-bold text-foreground">{payCode}</span>
          </p>

          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-alt p-3">
            <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2.5">
              <span dir="ltr" className="text-body font-bold tracking-wide text-foreground">
                {PAYMENT_CARD_NUMBER}
              </span>
              <button
                type="button"
                onClick={handleCopyCard}
                className="flex shrink-0 items-center gap-1 rounded-md bg-primary-soft px-2.5 py-1.5 text-label font-bold text-primary"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5" />
                    کپی شد
                  </>
                ) : (
                  "کپی شماره کارت"
                )}
              </button>
            </div>
            <p className="text-caption text-muted-foreground">
              به نام: <span className="font-bold text-foreground">{PAYMENT_CARD_OWNER}</span>
            </p>
            <p className="text-caption text-muted-foreground">
              بعد از واریز، عکس رسید رو همراه با کد رزروت (<span dir="ltr" className="font-bold">{payCode}</span>)
              برام بفرست:{" "}
              <a
                href="https://t.me/hammasirsite"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary underline underline-offset-4"
              >
                تلگرام
              </a>{" "}
              یا{" "}
              <a
                href="https://ble.ir/hammasirsite"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary underline underline-offset-4"
              >
                بله
              </a>
            </p>

            <div className="flex items-start gap-2.5 rounded-md bg-surface-alt px-3 py-2.5">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-caption text-muted-foreground">
                لطفاً تا قبل از تایید شدن رسید پرداخت، روی «پرداخت کردم» نزن. معمولاً تایید کمتر از نیم ساعت طول
                می‌کشه.
              </p>
            </div>
            <div className="flex items-start gap-3 border-t border-border pt-3">
              <Image
                src="/brand/founder.jpg"
                alt="امیرمهدی داودی‌کیا"
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
              <p className="text-caption leading-6 text-muted-foreground">
                سلام. من امیرمهدیم، کسی که هم‌مسیر رو ساخته. همشو. دست تنها و با پول تو جیبیام اوردم بالا و هنوز
                پولی واسه خرید درگاه پرداخت ندارم :) چند دقیقه بعد از پرداخت باهات تماس میگیرم تا تایم دقیق جلسه
                رو مشخص کنیم. مرسی که درک میکنی
              </p>
            </div>
          </div>
        </div>

        <Button size="lg" fullWidth onClick={handleDone}>
          پرداخت کردم
        </Button>
      </div>
    );
  }

  if (phase === "identity") {
    return <PhoneAuthGate onVerified={handleVerified} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <BookingSummaryCard mentor={mentor} plan={plan} slot={slot} />

      <div className="flex items-start gap-2.5 rounded-md bg-surface-alt px-4 py-3.5">
        <LockIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        {/* TODO: once escrow is implemented, make the hold explicit here —
            e.g. "تا پایان جلسه نزد هم‌مسیر می‌مونه و بعدش برای user آزاد می‌شه." */}
        <p className="text-caption text-muted-foreground">
          پرداختت امن انجام می‌شه و تا برگزاری جلسه نزد هم‌مسیر می‌مونه.
        </p>
      </div>

      <Button size="lg" fullWidth disabled={submitting} onClick={handlePay}>
        {submitting ? "در حال ثبت پرداخت…" : "پرداخت"}
      </Button>
    </div>
  );
}
