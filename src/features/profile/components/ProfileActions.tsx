"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChatIcon, CoinIcon, EditIcon, LogOutIcon, type IconProps } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { showToast } from "@/lib/toast";
import { useBookingsStore } from "@/store/bookingsStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useProfileStore } from "@/store/profileStore";
import { useProgressStore } from "@/store/progressStore";
import { logoutStudent } from "../actions";

interface ActionItem {
  key: string;
  label: string;
  Icon: (props: IconProps) => React.JSX.Element;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}

const rowClasses =
  "flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-4 text-start shadow-card transition-all duration-standard ease-gentle active:scale-[0.98] hover:border-primary-light";

/**
 * Four entry points below the completion card — edit/payments/support link
 * out. Logout has to clear two separate things: the real server-side session
 * (the httpOnly cookie getSessionStudent() reads — see logoutStudent) and
 * every piece of this device's cached identity (profile/bookings/onboarding
 * answers/progress ticks), or the next visit (or the next person on a shared
 * device) would still resolve to the same account through whichever one got
 * missed.
 */
export function ProfileActions() {
  const router = useRouter();
  const logoutProfile = useProfileStore((s) => s.logout);
  const clearBookings = useBookingsStore((s) => s.clearBookings);
  const clearOnboardingAnswers = useOnboardingStore((s) => s.clearAnswers);
  const clearProgressOverrides = useProgressStore((s) => s.clearOverrides);

  const items: ActionItem[] = [
    { key: "edit", label: "ویرایش پروفایل", Icon: EditIcon, href: "/student/profile/edit" },
    { key: "payments", label: "جلسه‌ها و تسویه", Icon: CoinIcon, href: "/student/profile/payments" },
    { key: "support", label: "پشتیبانی", Icon: ChatIcon, href: "/student/profile/support" },
    {
      key: "logout",
      label: "خروج از حساب",
      Icon: LogOutIcon,
      danger: true,
      onClick: () => {
        logoutStudent()
          .catch(() => {})
          .finally(() => {
            logoutProfile();
            clearBookings();
            clearOnboardingAnswers();
            clearProgressOverrides();
            showToast("با موفقیت خارج شدی", "success");
            router.push("/student/home");
            router.refresh();
          });
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {items.map(({ key, label, Icon, href, onClick, danger }) => {
        const content = (
          <>
            <span
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                danger ? "bg-alert-soft text-danger" : "bg-primary-soft text-primary",
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className={cn("text-body font-bold", danger ? "text-danger" : "text-foreground")}>{label}</span>
          </>
        );

        return href ? (
          <Link key={key} href={href} className={rowClasses}>
            {content}
          </Link>
        ) : (
          <button key={key} type="button" onClick={onClick} className={rowClasses}>
            {content}
          </button>
        );
      })}
    </div>
  );
}
