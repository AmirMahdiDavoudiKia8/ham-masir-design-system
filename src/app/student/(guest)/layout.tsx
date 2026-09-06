import { StudentShell } from "@/components/layout/StudentShell";

/** Pre-onboarding shell: auth/onboarding — no tab bar here, since there's nothing to navigate to until the intake quiz is done and a هم‌مسیر is picked. */
export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}
