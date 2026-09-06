import Link from "next/link";
import { SITE_CONTACTS, SITE_LEGAL_LINKS } from "@/lib/siteLinks";

/**
 * Bottom-of-page footer for the home tab's scrollable content — the one
 * place on this mobile-first, tab-bar-driven app that behaves like a
 * traditional page end, so it's the natural home for the legal/contact
 * links that would otherwise only live in the SupportFab dropdown.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 flex flex-col items-center gap-5 border-t border-border pt-6 text-center">
      <div className="flex flex-col items-center gap-1">
        <span className="text-h3 font-bold text-foreground">هم‌مسیر</span>
        <p className="text-caption text-muted-foreground">چون کنکور دو نفری آسون‌تره.</p>
      </div>

      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {SITE_LEGAL_LINKS.map(({ key, label, href }) => (
          <Link
            key={key}
            href={href}
            className="text-caption text-muted-foreground underline-offset-4 transition-colors duration-standard ease-gentle hover:text-foreground hover:underline"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {SITE_CONTACTS.map(({ key, href, Icon, label }) => (
          <a
            key={key}
            href={href}
            target={key === "phone" ? undefined : "_blank"}
            rel={key === "phone" ? undefined : "noopener noreferrer"}
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-standard ease-gentle hover:border-primary-light hover:text-primary"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>

      <p dir="ltr" className="text-label text-muted-foreground">
        &copy; {year} HamMasir
      </p>
    </footer>
  );
}
