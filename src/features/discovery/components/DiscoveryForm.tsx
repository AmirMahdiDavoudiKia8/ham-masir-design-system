"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/design-system";
import { SuggestInput } from "./SuggestInput";
import { ArrowLeftIcon, CalendarIcon, ChevronDownIcon, SearchIcon } from "@/design-system";
import { cn } from "@/lib/cn";
import { filterMentors, type Mentor, type MentorFilters } from "@/lib/mentorFilters";
import { toPersianDigits } from "@/lib/format";
import { MentorList } from "@/features/mentors/components/MentorList";
import { PersonalizedMatchCard } from "@/features/mentors/components/PersonalizedMatchCard";
import { ResultsBar } from "@/features/mentors/components/ResultsBar";
import { goalToRankFilter, useMatchQuizStore } from "@/store/matchQuizStore";
import { ExamTrackTabs } from "./ExamTrackTabs";
import { FilterSection } from "./FilterSection";
import { FIELDS_BY_TRACK } from "../fieldsByTrack";
import { GenderFilter, GENDER_OPTIONS, type GenderKey } from "./GenderFilter";
import { UniversityFilter } from "./UniversityFilter";

type DraftFilters = Omit<MentorFilters, "mainProblem" | "distraction" | "rankMin" | "rankMax">;

interface DiscoveryFormProps {
  /** Canonical mentor list, fetched server-side. */
  mentors: Mentor[];
}

/**
 * Owns the discovery filter state and, unlike the old two-page flow, shows
 * the full mentor list right here — no navigation to a separate results
 * page. Everything (track/university/field/gender, the collapsible search
 * drawer, and the "بهترین هم‌مسیرها برای تو" personalization toggle) starts
 * blank/closed on every mount — a fresh page load always shows every
 * mentor. The URL is still kept in sync (via router.replace, no scroll/nav)
 * purely so the current results are shareable mid-session — it's just never
 * read back on mount.
 *
 * Editing the form (track/university/field/gender) only edits a *draft* —
 * the list below isn't touched until "هم‌مسیرم را پیدا کن" is pressed, which
 * copies the draft into `appliedFilters`. Removing a chip in ResultsBar or
 * clearing filters from the empty state are themselves explicit actions
 * though, so those apply immediately rather than waiting for the button.
 */
export function DiscoveryForm({ mentors }: DiscoveryFormProps) {
  const router = useRouter();
  const quizAnswers = useMatchQuizStore((s) => s.answers);
  const quizAnswered = Boolean(quizAnswers.track);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [track, setTrack] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [field, setField] = useState("");
  const [gender, setGender] = useState<GenderKey>("any");
  const [appliedFilters, setAppliedFilters] = useState<DraftFilters>({});
  // Off by default even once the quiz is answered — ticking this on is what
  // actually narrows the list to the quiz's picks (see PersonalizedMatchCard).
  const [personalized, setPersonalized] = useState(false);

  const university = search.trim() || city || undefined;
  const fieldFilter = field.trim() || undefined;
  const genderLabel = gender !== "any" ? GENDER_OPTIONS.find((g) => g.key === gender)?.label : undefined;
  const fieldSuggestions = FIELDS_BY_TRACK[track] ?? [];

  // Zustand's persist middleware hydrates matchQuizStore from localStorage
  // asynchronously, after this component's first render, so quizAnswers.track
  // is empty at mount even for a student arriving straight from the quiz.
  // This only pre-fills the *draft* track chip (so opening the filter drawer
  // shows their quiz answer already selected) — it must NOT touch
  // appliedFilters, which drives the visible list. A fresh page load always
  // shows every mentor per this component's own doc comment above; auto-
  // applying the quiz track here previously broke that, silently hiding most
  // mentors from every quiz-taker until they noticed and cleared filters.
  const hasSyncedQuizTrackRef = useRef(false);
  useEffect(() => {
    if (hasSyncedQuizTrackRef.current || !quizAnswers.track) return;
    hasSyncedQuizTrackRef.current = true;
    setTrack((current) => current || quizAnswers.track);
  }, [quizAnswers.track]);

  const draftFilters: DraftFilters = useMemo(
    () => ({ track: track || undefined, university, field: fieldFilter, gender: genderLabel }),
    [track, university, fieldFilter, genderLabel],
  );

  // How many mentors the draft *would* match — a live preview above the
  // button, purely informational. The actual list below only updates once
  // the draft is applied (see applyFilters).
  const previewCount = useMemo(() => filterMentors(mentors, draftFilters).length, [mentors, draftFilters]);

  // goal maps to a rank range (goalToRankFilter); mainProblem/distraction
  // match against each mentor's own Mentor.matchTags. Only applied while
  // `personalized` is on — see the component doc comment above.
  const quizRank = personalized ? goalToRankFilter(quizAnswers.goal) : {};

  const filters: MentorFilters = useMemo(
    () => ({
      ...appliedFilters,
      mainProblem: personalized ? quizAnswers.mainProblem || undefined : undefined,
      distraction: personalized ? quizAnswers.distraction || undefined : undefined,
      rankMin: quizRank.rankMin,
      rankMax: quizRank.rankMax,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appliedFilters, personalized, quizAnswers.mainProblem, quizAnswers.distraction, quizAnswers.goal],
  );

  const results = useMemo(() => filterMentors(mentors, filters), [mentors, filters]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (appliedFilters.track) params.set("track", appliedFilters.track);
    if (appliedFilters.university) params.set("university", appliedFilters.university);
    if (appliedFilters.field) params.set("field", appliedFilters.field);
    if (appliedFilters.gender) params.set("gender", appliedFilters.gender);
    return params.toString();
  }, [appliedFilters]);

  // Keeps the URL shareable mid-session — never re-read on mount (see doc
  // comment above), so it has no bearing on what a fresh visit shows.
  useEffect(() => {
    router.replace(queryString ? `/student/discover?${queryString}` : "/student/discover", { scroll: false });
  }, [queryString, router]);

  const resultsRef = useRef<HTMLDivElement>(null);

  function applyFilters() {
    setAppliedFilters(draftFilters);
    setDrawerOpen(false);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleTrackChange(nextTrack: string) {
    // Tapping the already-selected track clears it, back to "every track".
    setTrack((current) => (current === nextTrack ? "" : nextTrack));
    // A university/field picked for the old track no longer necessarily
    // makes sense against the new one, so switching track resets both.
    setCity(null);
    setSearch("");
    setField("");
  }

  // Removing a chip is an explicit, immediate action — no reason to make it
  // wait for "هم‌مسیرم را پیدا کن" — so this updates both the draft (so the
  // form reflects it if reopened) and the applied filters actually driving
  // the list, together.
  function removeFilter(keys: (keyof MentorFilters)[]) {
    for (const key of keys) {
      if (key === "university") {
        setCity(null);
        setSearch("");
      } else if (key === "field") {
        setField("");
      } else if (key === "gender") {
        setGender("any");
      }
    }
    setAppliedFilters((prev) => {
      const next = { ...prev };
      for (const key of keys) delete next[key as keyof DraftFilters];
      return next;
    });
  }

  // Same idea as removeFilter — "پاک کردن فیلترها" from the empty state is
  // itself the explicit action, so it clears both draft and applied at once.
  function resetFilters() {
    setCity(null);
    setSearch("");
    setField("");
    setGender("any");
    setAppliedFilters((prev) => ({ track: prev.track }));
  }

  const SECTIONS = [
    { title: "رشته کنکور", content: <ExamTrackTabs value={track} onChange={handleTrackChange} /> },
    {
      title: "دانشگاه",
      content: (
        <UniversityFilter city={city} onCityChange={setCity} search={search} onSearchChange={setSearch} />
      ),
    },
    {
      title: "رشته تحصیلی هم‌مسیر",
      content: (
        <SuggestInput
          value={field}
          onChange={setField}
          suggestions={fieldSuggestions}
          placeholder="جستجوی رشته تحصیلی..."
        />
      ),
    },
    { title: "جنسیت هم‌مسیر", content: <GenderFilter value={gender} onChange={setGender} /> },
  ];

  return (
    <>
      <div className="animate-rise-in rounded-lg border border-border bg-surface shadow-card">
        <button
          type="button"
          onClick={() => setDrawerOpen((o) => !o)}
          aria-expanded={drawerOpen}
          className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3.5"
        >
          <span className="flex items-center gap-2 text-body font-bold text-foreground">
            <SearchIcon className="h-[18px] w-[18px] text-muted-foreground" />
            جستجو و فیلترها
          </span>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-standard ease-gentle",
              drawerOpen && "rotate-180",
            )}
          />
        </button>

        <div
          className={cn(
            "grid transition-all duration-standard ease-gentle",
            drawerOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          {/* Grid items default to min-height:auto, which stops the row from
              actually shrinking back to 0fr on close (content keeps forcing
              its intrinsic height) — min-h-0 overrides that so the collapse
              direction animates the same as the expand direction. */}
          <div className="min-h-0 overflow-hidden">
            <div className="flex flex-col gap-5 border-t border-border px-4 pb-5 pt-4">
              {SECTIONS.map(({ title, content }) => (
                <FilterSection key={title} title={title}>
                  {content}
                </FilterSection>
              ))}

              <p className="text-center text-caption text-muted-foreground">
                <span className="font-bold text-primary">{toPersianDigits(previewCount)}</span> هم‌مسیر با این فیلترها
              </p>

              <Button size="lg" fullWidth onClick={applyFilters}>
                هم‌مسیرم را پیدا کن
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div ref={resultsRef} className="flex flex-col gap-5 pt-1">
        <h2 className="text-h3 font-bold text-foreground">همه هم‌مسیرها</h2>
        <PersonalizedMatchCard
          answered={quizAnswered}
          active={personalized}
          onToggle={() => setPersonalized((v) => !v)}
        />
        <Link
          href="/planner"
          className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 shadow-card transition-all duration-standard ease-gentle active:scale-[0.98] hover:border-primary-light"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <CalendarIcon className="h-5 w-5" />
          </span>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-body font-bold text-foreground">برنامه‌ساز کنکور — رایگان</h3>
            <p className="text-caption text-muted-foreground">
              قبل از انتخاب هم‌مسیر، یه برنامه‌ی مطالعه‌ی کلی برای خودت بساز.
            </p>
          </div>
        </Link>
        <ResultsBar filters={{ ...filters, track: undefined }} onRemove={removeFilter} />
        <MentorList mentors={results} queryString={queryString} onResetFilters={resetFilters} />
      </div>
    </>
  );
}
