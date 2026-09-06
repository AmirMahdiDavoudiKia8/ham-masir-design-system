import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

/**
 * Only the pages a cold, logged-out visitor (or Googlebot) can actually land
 * on and get real content from — /student/discover and /student/mentors
 * lean on client-side quiz-answer state and aren't safe to list here yet.
 * `/` itself is a permanent redirect to /student/home, so the redirect
 * target is what's listed, not the redirect itself.
 */
const ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/student/home", changeFrequency: "weekly", priority: 1 },
  { path: "/planner", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
