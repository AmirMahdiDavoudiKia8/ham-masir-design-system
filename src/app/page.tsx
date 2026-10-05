import { permanentRedirect } from "next/navigation";

/**
 * The role-selection screen is gone — students land straight on the home page
 * now. This is a **permanent** (308) redirect on purpose: a 307 tells search
 * engines "/" is only temporarily elsewhere, so they keep it indexed as its
 * own URL and never consolidate its ranking signals onto /student/home. The
 * root domain is the strongest URL this site has; it must hand that strength
 * over, not sit on it.
 */
export default function RootPage() {
  permanentRedirect("/student/home");
}
