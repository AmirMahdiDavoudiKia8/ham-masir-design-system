import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/mentor/admin", "/mentor/portal", "/api", "/student/booking", "/student/profile"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
