import type { Metadata } from "next";

/**
 * The student's own account area — profile, edit form, session/settlement
 * history, support. None of it is ever a legitimate search result: the only
 * page here with public-facing content (support) just repeats the contact
 * details the site footer already carries.
 *
 * Declared on the layout rather than on each page so a new subroute inherits
 * it instead of having to remember; note that a page setting its own
 * `metadata.robots` replaces this rather than merging with it.
 *
 * robots.txt still Disallows /student/profile, so Google does not fetch these
 * pages today and never reads this directive — that is the point. The
 * Disallow is what keeps them out now; this is what keeps them out the day
 * someone relaxes it. Same reasoning as /student/progress, which is the
 * mirror image: crawlable on purpose, because there the noindex is the only
 * thing doing the work.
 */
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
