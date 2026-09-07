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
 */
const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/student/home", changeFrequency: "weekly", priority: 1 },
  { path: "/student/discover", changeFrequency: "weekly", priority: 0.9 },
  { path: "/planner", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
];

/**
 * Mentor profiles are the site's long-tail — one indexable page per real
 * person, each with a name, university, rank and their own written story.
 * They were missing from the sitemap entirely, so nothing pointed a crawler
 * at them except the client-rendered list. Generated from the same
 * getMentors() the pages themselves read, so a mentor added or unpublished
 * in the portal shows up (or drops out) here with no second list to update.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const mentors = await getMentors();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...mentors.map((mentor) => ({
      url: `${SITE_URL}/student/mentors/${mentor.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
