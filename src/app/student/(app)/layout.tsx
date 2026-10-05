import { BottomNav } from "@/components/navigation/BottomNav";
import { StudentShell } from "@/components/layout/StudentShell";

/** Post-onboarding shell: home/discover/mentors/progress/profile/booking/chat — everything the tab bar can actually reach. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell nav={<BottomNav />}>{children}</StudentShell>;
}
