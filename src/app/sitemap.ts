import { stat } from "node:fs/promises";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getMentors } from "@/lib/mentors";
import { SITE_URL } from "@/lib/siteConfig";

/**
 * Only the pages a cold, logged-out visitor (or Googlebot) can actually land
 * on and get real content from. `/` itself permanently redirects to
 * /student/home (see app/page.tsx), so the redirect target is what's listed,
 * not the redirect itself.
 *
 * `/student/discover` is listed even though it has client-side filter state:
 * it renders the full, unfiltered mentor list server-side, which is exactly
 * what a crawler should see and what gives the individual profiles their
 * internal links. `/student/mentors` is deliberately absent — it is a bare
 * redirect to /student/discover, and listing a redirect just spends crawl
 * budget to be told to go somewhere else.
 *
 * No `priority` or `changeFrequency` on any entry: Google has stated plainly
 * that it ignores both, so they were pure noise.
 */
const STATIC_ROUTES = [
  "/student/home",
  "/student/discover",
  "/planner",
  "/about",
  "/terms",
  "/privacy",
];

/** Rebuild hourly so a mentor edit reaches the sitemap without waiting for a deploy. */
export const revalidate = 3600;

const CATALOGUE_FILE = path.join(process.cwd(), "src/data/mentors/mentors.json");

/**
 * A real modification time for the mentor catalogue, or undefined.
 *
 * This replaces `lastModified: new Date()`, which stamped every URL with the
 * time the sitemap was generated. That is worse than useless: Google's docs
 * are explicit that it ignores `lastmod` entirely once it finds the value
 * unreliable, so an always-now timestamp doesn't just fail to help — it
 * discards the crawl-scheduling signal for the whole file. The catalogue
 * file's mtime is a genuine signal (on the VPS it's symlinked to persistent
 * storage, so it moves only when a mentor is actually added or edited).
 *
 * Static pages get no `lastModified` at all, because nothing here knows when
 * their copy last changed and an invented date is what caused this problem in
 * the first place.
 */
async function catalogueModified(): Promise<Date | undefined> {
  try {
    return (await stat(CATALOGUE_FILE)).mtime;
  } catch {
    return undefined;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [mentors, lastModified] = await Promise.all([getMentors(), catalogueModified()]);

  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` })),
    // Mentor profiles are the site's long-tail — one indexable page per real
    // person, each with a name, university, rank and their own written story.
    // Generated from the same getMentors() the pages themselves read, so a
    // mentor added or unpublished in the portal shows up (or drops out) here
    // with no second list to update.
    ...mentors.map((mentor) => ({
      url: `${SITE_URL}/student/mentors/${mentor.id}`,
      ...(lastModified ? { lastModified } : {}),
    })),
  ];
}
