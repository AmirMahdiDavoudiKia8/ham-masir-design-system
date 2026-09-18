"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PayAfterPromise } from "@/components/brand/PayAfterPromise";
import { Button } from "@/components/ui/Button";
import { CheckIcon, PhoneIcon } from "@/components/ui/icons";
import { PhoneAuthGate } from "@/features/auth/components/PhoneAuthGate";
import { trackClick } from "@/lib/analyticsClient";
import type { Mentor } from "@/lib/mentors";
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

type Phase = "identity" | "reserve";

/**
 * Screen B0: before a student's very first reservation, we don't actually
 * know who they are yet — so this gates the reservation UI behind
 * PhoneAuthGate (features/auth), the phone+password stand-in for real OTP (see
 * that component's doc comment for why). Always starts at "identity" on the
 * very first render (server and client agree, so no hydration mismatch),
 * but a mount effect immediately advances past it to "reserve" if profileStore
 * already has a verified name+phone from a previous booking — a returning
 * student never gets re-asked, and a phone number can't end up saved under
 * two different names since there's only ever one profile per device to
 * read from (and the gate itself rejects a name mismatch server-side too).
 *
 * Once verified, name+phone are written to the shared profileStore so the
 * rest of the app (profile screen, completion gauge) picks them up too.
 *
 * Nothing is charged here, by design: the site's promise is «اول جلسه، بعد
 * پرداخت» (see components/brand/PayAfterPromise), so this screen takes no
 * money, shows no card number and has no "پرداخت کردم" button. It creates
 * the same pending record it always did (src/lib/paymentRequests) for its
 * short reference code — now read as "session reserved, not yet settled" —
 * and settlement is arranged by phone after the session actually happens.
 * The route is still .../payment so the analytics funnel (lib/analytics's
 * paymentPageViews, which matches on the path) keeps its history.
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
  const [reserveCode, setReserveCode] = useState<string | null>(null);

  // Zustand's persist middleware hydrates profileStore/bookingsStore from
  // localStorage asynchronously, after this component's first render — a
  // direct/fresh load of this screen (bookmark, refresh, coming back from
  // "خانه" mid-flow) could mount with both still at their empty defaults.
  // The original single mount-only effect reacted to that emptiness as "a
  // brand-new visitor", re-showing PhoneAuthGate to an already-verified
  // returning student and failing to restore an in-progress reservation. Two
  // separate ref-guarded effects, each keyed on its own store's data
  // actually showing up, fix both independently instead of relying on one
  // mount-time snapshot of both at once.
  const hasSyncedProfileRef = useRef(false);
  useEffect(() => {
    if (hasSyncedProfileRef.current || !profile.name.trim() || !profile.phone.trim()) return;
    hasSyncedProfileRef.current = true;
    setName(profile.name);
    setPhone(profile.phone);
    setPhase("reserve");
    fetchAndRestoreBookings(profile.phone.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.name, profile.phone]);

  const hasSyncedCodeRef = useRef(false);
  useEffect(() => {
    if (hasSyncedCodeRef.current) return;
    const existing = bookings.find((b) => b.mentorId === mentor.id && b.plan === plan && b.slot === slot);
    if (!existing?.payCode) return;
    hasSyncedCodeRef.current = true;
    setReserveCode(existing.payCode);
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

  function handleVerified(verifiedName: string, verifiedPhone: string) {
    setName(verifiedName);
    setPhone(verifiedPhone);
    updateProfile({ name: verifiedName, phone: verifiedPhone });
    fetchAndRestoreBookings(verifiedPhone);
    setPhase("reserve");
  }

  async function handleReserve() {
    // Stable label kept from the pre-«پرداخت بعد از جلسه» flow on purpose —
    // it's the same funnel step, so renaming it would split the history.
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

      // The moment the reservation record is created is the one place a
      // booking gets created — this is what makes it show up correctly in
      // "جلسه‌های من", even though settlement happens after the session.
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
      setReserveCode(data.code);
    } finally {
      setSubmitting(false);
    }
  }

  function handleDone() {
    const params = new URLSearchParams({ plan, slot });
    router.push(`/student/booking/${mentor.id}/confirmation?${params.toString()}`);
  }

  if (reserveCode) {
    return (
      <div className="flex flex-col gap-6">
        <BookingSummaryCard mentor={mentor} plan={plan} slot={slot} />

        <div className="flex flex-col gap-3 rounded-lg border-2 border-primary-light/60 bg-surface p-4 shadow-card">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
              <CheckIcon className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <p className="text-body font-bold text-foreground">رزروت ثبت شد — بدون هیچ پرداختی</p>
          </div>
          <p className="text-caption leading-[1.9] text-muted-foreground">
            کد رزروت: <span dir="ltr" className="font-bold text-foreground">{reserveCode}</span> — همینو نگه دار،
            هر وقت درباره‌ی این جلسه حرف زدیم باهاش پیدات می‌کنیم.
          </p>

          <div className="flex items-start gap-2.5 rounded-md bg-surface-alt px-3 py-2.5">
            <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-caption leading-[1.9] text-muted-foreground">
              قدم بعدی با ماست: به‌زودی باهات تماس می‌گیریم تا تایم دقیق جلسه رو با هم‌مسیرت هماهنگ کنیم. تا اون
              موقع لازم نیست هیچ کاری بکنی.
            </p>
          </div>
        </div>

        <Button size="lg" fullWidth onClick={handleDone}>
          ادامه
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

      <PayAfterPromise />

      <p className="text-caption leading-[1.9] text-muted-foreground">
        با زدن دکمه‌ی پایین فقط جلسه‌ات رزرو می‌شه. هیچ مبلغی الان از تو گرفته نمی‌شه و برای رزرو به شماره کارت و
        درگاه پرداخت نیازی نیست.
      </p>

      <Button size="lg" fullWidth disabled={submitting} onClick={handleReserve}>
        {submitting ? "در حال ثبت رزرو…" : "رزرو جلسه"}
      </Button>
    </div>
  );
}
