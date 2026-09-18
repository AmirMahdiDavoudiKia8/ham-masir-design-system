import { CompactHeader } from "@/components/layout/CompactHeader";
import { ChatIcon, PhoneIcon, SendIcon } from "@/components/ui/icons";
import { SITE_BALE, SITE_TELEGRAM } from "@/lib/siteConfig";

/**
 * Deliberately NOT built from SITE_CONTACTS: this list is support-framed
 * ("پشتیبانی در تلگرام", not "تلگرام") and carries an SMS option the general
 * contact list doesn't. Only the URLs are shared, so changing a handle in
 * siteConfig can't leave this page pointing at the old one.
 *
 * TODO: no real support channel is wired up yet — swap these for a live chat
 * widget / ticketing integration once one exists.
 */
export default function ProfileSupportPage() {
  return (
    <>
      <CompactHeader title="پشتیبانی" backHref="/student/profile" />
      <div className="flex flex-col gap-3 px-4 pb-2 pt-6">
        <a
          href="tel:09920209010"
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-card transition-all duration-standard ease-gentle active:scale-[0.98] hover:border-primary-light"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <PhoneIcon className="h-5 w-5" />
          </span>
          <span className="flex flex-col">
            <span className="text-body font-bold text-foreground">تماس با پشتیبانی</span>
            <span dir="ltr" className="text-caption text-muted-foreground">
              09920209010
            </span>
          </span>
        </a>

        <a
          href="sms:09920209010"
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-card transition-all duration-standard ease-gentle active:scale-[0.98] hover:border-primary-light"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-soft text-secondary-foreground">
            <ChatIcon className="h-5 w-5" />
          </span>
          <span className="text-body font-bold text-foreground">پیامک به پشتیبانی</span>
        </a>

        <a
          href={SITE_TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-card transition-all duration-standard ease-gentle active:scale-[0.98] hover:border-primary-light"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <SendIcon className="h-5 w-5" />
          </span>
          <span className="text-body font-bold text-foreground">پشتیبانی در تلگرام</span>
        </a>

        <a
          href={SITE_BALE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-card transition-all duration-standard ease-gentle active:scale-[0.98] hover:border-primary-light"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <SendIcon className="h-5 w-5" />
          </span>
          <span className="text-body font-bold text-foreground">پشتیبانی در بله</span>
        </a>
      </div>
    </>
  );
}
