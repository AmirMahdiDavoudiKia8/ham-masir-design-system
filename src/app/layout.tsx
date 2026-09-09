import type { Metadata } from "next";
import { SupportFab } from "@/components/support/SupportFab";
import { Toast } from "@/components/ui/Toast";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { pinar } from "@/lib/fonts";
import {
  SITE_BALE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_PHONE,
  SITE_TAGLINE,
  SITE_TELEGRAM,
  SITE_URL,
} from "@/lib/siteConfig";
import "./globals.css";

export const metadata: Metadata = {
  // Without metadataBase, every relative canonical/OG URL below resolves
  // against localhost in the build output and silently ships broken.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — مشاوره و برنامه‌ریزی کنکور با کسی که راهت رو رفته`,
    // Every page that sets its own title gets the brand appended for free,
    // so no page has to hand-write "| هم‌مسیر" again (several used to).
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // No site-wide `alternates.canonical`. Next inherits it into every page that
  // doesn't set its own, which had /student/progress, /student/onboarding,
  // /student/mentors/quiz, /student/profile/* and the mentor-portal pages all
  // declaring themselves duplicates of "/" — a URL that 308-redirects away.
  // Each indexable page states its own canonical instead.
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Lets Google show a full-length snippet and a large image thumbnail
      // instead of the conservative defaults it picks on its own.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "Ham Masir",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  image: SITE_OG_IMAGE.url,
  description: SITE_DESCRIPTION,
  slogan: "مسیرت رو تنها نرو",
  sameAs: [SITE_TELEGRAM, SITE_BALE],
  areaServed: { "@type": "Country", name: "Iran" },
  knowsLanguage: "fa",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: SITE_PHONE,
    contactType: "customer service",
    areaServed: "IR",
    availableLanguage: "Persian",
  },
};

/**
 * Names the site itself, separate from the organization that runs it, and
 * gives every other page's JSON-LD a stable `isPartOf` target to point at
 * (see the mentor profile and home page graphs).
 */
const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "fa-IR",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={pinar.variable}>
      <head>
        {/*
          Kavenegar's activation checker fetches the raw HTML and greps for a
          literal <script> tag — next/script's beforeInteractive strategy
          instead emits a <link rel="preload"> + client-side injection, which
          the checker never sees. Must stay a plain, static <script> tag
          matching their exact snippet (defer, no strategy prop).
          Pairs with public/kvn-push-sw.js (the service worker it registers
          at /kvn-push-sw.js).
        */}
        <script
          src="https://cdn.kavenegar.com/sdk/page.js?appId=7d60e130-ad8d-45ec-b0f0-b2f64ebdec1d"
          defer
          charSet="utf-8"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <Toast />
        <AnalyticsTracker />
        {children}
        <SupportFab />
      </body>
    </html>
  );
}
