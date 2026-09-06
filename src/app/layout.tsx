import type { Metadata } from "next";
import { SupportFab } from "@/components/support/SupportFab";
import { Toast } from "@/components/ui/Toast";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { pinar } from "@/lib/fonts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import "./globals.css";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  sameAs: ["https://t.me/hammasirsite", "https://ble.ir/hammasirsite"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+989920209010",
    contactType: "customer service",
  },
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
