import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { AccompaniedLineIcon } from "@/components/ui/icons";
import { MentorAvailability } from "@/features/mentors/components/MentorAvailability";
import { MentorIdentity } from "@/features/mentors/components/MentorIdentity";
import { MentorNarrative } from "@/features/mentors/components/MentorNarrative";
import { MentorPlans } from "@/features/mentors/components/MentorPlans";
import { MentorProfileHeader } from "@/features/mentors/components/MentorProfileHeader";
import { getMentors } from "@/lib/mentors";
import type { Mentor } from "@/lib/mentors";
import { firstParam } from "@/lib/searchParams";
import { SITE_NAME, SITE_OG_IMAGE, SITE_URL, pageOpenGraph } from "@/lib/siteConfig";
import { getUniversityLogo } from "@/lib/universityLogos";

/**
 * "دندان‌پزشکی اصفهان" — the short credential that goes in the title. Field and
 * university only: `rank` is already a full phrase in the data
 * ("کنکور ۱۴۰۴ — رتبه ۱۷۶ منطقه دو"), so folding it in here blew the title past the
 * ~60 characters Google actually renders and pushed the mentor's own name
 * toward the truncated end. It goes in the description instead.
 */
function shortCredential(mentor: Mentor): string {
  return [mentor.field, mentor.university].filter(Boolean).join(" ");
}

/** Search snippets are cut around 160 chars — trim on a word boundary so the description ends as a phrase, not mid-word. */
function clamp(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/**
 * These 19 profiles are the site's long-tail: someone searching a mentor's
 * name, or "مشاور کنکور دانشجوی پزشکی تهران", should land here. They shipped with no
 * title, description or canonical at all, so every one of them competed with
 * the others under the identical brand-only title.
 *
 * The description prefers the mentor's own `bio` over a generated sentence —
 * real prose written by a real person outranks a template, and it's what a
 * searcher actually wants to read in the snippet.
 */
export async function generateMetadata({ params }: MentorProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const mentors = await getMentors();
  const mentor = mentors.find((m) => m.id === id);

  // A profile that no longer exists renders the "پیدا نکردیم" state below;
  // tell crawlers not to index that rather than letting a soft-404 in.
  if (!mentor) {
    return { title: "هم‌مسیر پیدا نشد", robots: { index: false, follow: true } };
  }

  const name = mentor.name ?? SITE_NAME;
  const creds = shortCredential(mentor);
  const title = creds ? `${name} — ${creds}` : name;
  // Lead the snippet with the credentials a searcher scans for (field,
  // university, rank), then hand the rest of the line to the mentor's own
  // words — real prose reads better in a result than a template ever does.
  const facts = [creds, mentor.rank].filter(Boolean).join("، ");
  const description = clamp(
    mentor.bio?.trim()
      ? `${facts ? `${facts}. ` : ""}${mentor.bio.trim()}`
      : `${name}${facts ? `، ${facts}` : ""}. یک جلسه‌ی ۴۵ دقیقه‌ای مشاوره‌ی کنکور بذار و بعد از جلسه پرداخت کن — فقط اگه راضی بودی.`,
  );
  const path = `/student/mentors/${mentor.id}`;
  const image = mentor.photo ? { url: `${SITE_URL}${mentor.photo}`, alt: name } : SITE_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: pageOpenGraph({
      path,
      type: "profile",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    }),
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [image.url] },
  };
}

interface MentorProfilePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * The mentor's full story — the destination MentorCard now navigates to
 * directly, replacing the old booking bottom sheet. Resolves the mentor by
 * id from the one canonical source (lib/mentors.ts); never declares its own
 * mentor data. Every section is independently optional and hides itself
 * rather than rendering empty (canon: degrade gracefully, never broken UI).
 */
export default async function MentorProfilePage({ params, searchParams }: MentorProfilePageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const back = firstParam(sp.back);
  const resultsHref = `/student/discover${back ? `?${back}` : ""}`;

  const mentors = await getMentors();
  const mentor = mentors.find((m) => m.id === id);

  /*
   * Rendered inline at HTTP 200 rather than via notFound(), deliberately.
   *
   * notFound() cannot produce a real 404 here: loading.tsx puts this segment
   * behind a Suspense boundary, so response headers are flushed before the
   * throw and the status is already committed. Measured all three ways on a
   * production build:
   *   - inline (this)            -> 200, full HTML in the initial response
   *   - notFound(), no loading   -> 404, full HTML, but every mentor profile
   *                                 loses its skeleton on client navigation
   *   - notFound(), with loading -> 200 AND an empty initial body (worst)
   * Valid profiles server-render identically (1554 chars) in all three, so
   * loading.tsx costs nothing at SSR — it only breaks the status code.
   *
   * Keeping the skeleton wins: TTFB on the 1 vCPU box swings from ~90ms warm
   * to several seconds cold, and a blank screen for that long on the main
   * conversion path is a real cost to every student. The page it buys is a
   * soft 404 on dead slugs — cosmetic here, because generateMetadata already
   * returns noindex for them so they are never indexed, and crawl budget on a
   * 25-URL site is not a constraint. Revisit if the catalogue ever grows large
   * enough for crawl budget to matter.
   */
  if (!mentor) {
    return (
      <>
        <div className="relative h-14">
          <MentorProfileHeader backHref={resultsHref} />
        </div>
        <div className="flex flex-col items-center gap-4 px-6 pb-2 pt-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <AccompaniedLineIcon className="h-7 w-7" />
          </span>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-h2 font-bold text-foreground">این هم‌مسیر رو پیدا نکردیم</h1>
            <p className="max-w-[24rem] text-caption text-muted-foreground">
              شاید پروفایلش جابه‌جا شده باشه. برگرد به نتایج و یکی دیگه رو پیدا کن.
            </p>
          </div>
          <Link href={resultsHref} className={buttonClasses("primary", "md", false, "mt-1")}>
            بازگشت به نتایج
          </Link>
        </div>
      </>
    );
  }

  const universityLogo = getUniversityLogo(mentor.university);
  const name = mentor.name ?? SITE_NAME;

  // Person, not Product: what's on offer is a named human being's experience.
  // `aggregateRating` is emitted only when this mentor genuinely has both a
  // rating and a review count — inventing either would be fabricating a
  // review signal about a real person.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/student/mentors/${mentor.id}#person`,
    name,
    url: `${SITE_URL}/student/mentors/${mentor.id}`,
    ...(mentor.photo ? { image: `${SITE_URL}${mentor.photo}` } : {}),
    ...(mentor.bio ? { description: mentor.bio } : {}),
    jobTitle: "هم‌مسیر (مشاور کنکور)",
    ...(mentor.university ? { alumniOf: { "@type": "CollegeOrUniversity", name: mentor.university } } : {}),
    ...(mentor.field ? { knowsAbout: [mentor.field, "کنکور", "برنامه‌ریزی درسی"] } : {}),
    worksFor: { "@id": `${SITE_URL}/#organization` },
    // Deliberately NO aggregateRating. `mentor.rating`/`reviewsCount` exist in
    // mentors.json but nothing renders them — MentorReviews and RatingBadge are
    // written but never imported by any page — and the data itself is launch
    // placeholder (every rated mentor has exactly 2 reviews, only 5 or 4.5
    // stars, generic author labels like "دانش‌آموز تجربی، پشت‌کنکوری").
    // Emitting it would be review markup that no visitor can see, about real
    // named people, from numbers nobody gave us. That breaks Google's
    // structured-data policy and is exactly the kind of claim we must not make
    // about a real person. Re-add only when reviews are genuinely collected
    // AND rendered on this page.
  };

  // Gives Google the "خانه › هم‌مسیرها › نام" trail it shows instead of a
  // raw URL under the result title.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: `${SITE_URL}/student/home` },
      { "@type": "ListItem", position: 2, name: "هم‌مسیرها", item: `${SITE_URL}/student/discover` },
      { "@type": "ListItem", position: 3, name, item: `${SITE_URL}/student/mentors/${mentor.id}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="relative">
        <div className="relative h-28 overflow-hidden rounded-b-[28px] bg-gradient-to-br from-primary-hover to-primary">
          {universityLogo && (
            <Image
              src={universityLogo}
              alt=""
              aria-hidden
              fill
              priority
              className="scale-125 object-contain opacity-35 mix-blend-multiply"
            />
          )}
        </div>
        <MentorProfileHeader backHref={resultsHref} />
        <div className="-mt-12 px-5">
          <MentorIdentity mentor={mentor} />
        </div>
      </div>

      <div className="flex flex-col gap-9 px-5 pb-10 pt-9">
        <div className="border-t border-border pt-9">
          <MentorNarrative mentor={mentor} />
        </div>

        <div className="border-t border-border pt-9">
          <MentorAvailability mentor={mentor} />
        </div>

        <div className="border-t border-border pt-9">
          <MentorPlans mentor={mentor} back={back} />
        </div>
      </div>
    </>
  );
}
