import type { Mentor } from "@/lib/mentors";

interface MentorNarrativeProps {
  mentor: Mentor;
}

/**
 * The heart of the profile (canon Part V: "a profile is a narrative, not a
 * résumé"; A.6: this must carry at least as much visual weight as the
 * credentials above it). No card border, no boxing — this is for reading,
 * not browsing, so it sits directly on the page with generous line-height
 * and real space between sections. Each block is independently optional;
 * hidden entirely rather than rendered empty.
 */
export function MentorNarrative({ mentor }: MentorNarrativeProps) {
  const { bio, journey, lessons, helpsWith, voiceIntro } = mentor;
  const hasHelpsWith = helpsWith && helpsWith.length > 0;

  if (!bio && !journey && !lessons && !hasHelpsWith && !voiceIntro) return null;

  return (
    // Reading-width cap — the shared shell widens a lot on a laptop screen
    // (see StudentShell) which is great for grids/cards, but a paragraph
    // stretched that wide is uncomfortable to read; long-form prose gets
    // its own narrower column regardless of how wide the page around it is.
    <div className="flex flex-col gap-8 lg:mx-auto lg:max-w-2xl">
      {bio && <p className="text-h3 font-medium text-foreground">{bio}</p>}

      {voiceIntro && (
        <section className="flex flex-col gap-2.5">
          <h2 className="text-label font-bold text-primary">صدای هم‌مسیر</h2>
          <audio controls src={voiceIntro} className="w-full" />
        </section>
      )}

      {journey && (
        <section className="flex flex-col gap-2.5">
          <h2 className="text-label font-bold text-primary">مسیری که رفته</h2>
          <p className="text-body text-foreground">{journey}</p>
        </section>
      )}

      {lessons && (
        <section className="flex flex-col gap-2.5">
          <h2 className="text-label font-bold text-primary">چیزی که یاد گرفته</h2>
          <p className="text-body text-foreground">{lessons}</p>
        </section>
      )}

      {hasHelpsWith && (
        <section className="flex flex-col gap-3">
          <h2 className="text-label font-bold text-primary">با چی می‌تونه کمکت کنه</h2>
          <ul className="flex flex-col gap-2.5">
            {helpsWith.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-body text-foreground">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-dark" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
