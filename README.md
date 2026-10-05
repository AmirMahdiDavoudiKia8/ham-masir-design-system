# Ham-Masir — Design System Assignment

The Ham-Masir product shipped with its UI components scattered across
`src/components/ui`, disconnected from the Storybook design system. This work
extracts the real reusable patterns from the product, consolidates them into
one system, connects the product to it, and documents everything in Storybook —
without redesigning any screen.

## Architecture (final)

```
Product features / app routes
  →  @/design-system            (single source of truth)
    →  design tokens / foundations
```

`src/components/ui` no longer exists. Feature-specific components
(`MentorAvatar`, `SuggestInput`, planner fields, app chrome) intentionally stay
in their features — generic primitives belong in the system, domain patterns
stay with their domain.

## What was done (per phase)

- **Phase 0** — fixed two verified DS bugs (Avatar `src` branch dropped
  `{...props}`; Checkbox `className` sat on the inner `span` instead of the
  `label`). No API or visual changes.
- **Phase 1A** — migrated `Tag` (3 consumers) into the system with a story.
- **Phase 1** — audited the whole product, aligned the DS with shipped styles
  first, then migrated every shared consumer: Button (+`buttonClasses`), Input,
  Chip, Card, EmptyState, ProgressBar, Sheet (ex-BottomSheet), Toast, the icon
  set (~49 icons, ~51 files). Removed dead `RatingBadge`/legacy `VerifiedBadge`
  (zero consumers each). `SuggestInput` moved to the discovery feature.
- **Sheet fix** — the moved file had carried an uncommitted panel restyle;
  reverted to the shipped `rounded-t-lg` / `shadow-lifted` styling.
- **Sidebar** — Storybook navigation reorganized into
  Introduction / FOUNDATIONS / COMPONENTS / FORMS / FEEDBACK / OVERLAYS with an
  explicit `storySort`; the domain-specific `MentorCard` story was removed from
  the generic sidebar (component and product untouched).
- **Honesty pass** — every DS component now carries a one-line `Status`:
  `canonical` (ships on real screens), `proposal` (generic reserve, unadopted),
  `pending-decision` (Textarea, Avatar — real patterns exist, alignment open),
  `retire-candidate` (Checkbox, Badge, VerifiedBadge, MentorCard shell).

## Key decisions (and why)

- **Product is the reference.** Where the DS disagreed with shipped UI
  (Button gradient vs flat, Chip without check icon, Card padding, Input field
  metrics), the DS was changed — never the product.
- **No fake adoption.** Badge/Alert/Checkbox were NOT forced into screens to
  justify themselves; unadopted components are labeled as proposals instead.
- **Status pills ship as Tag**, so DS Badge is marked for retirement rather
  than kept as a parallel alternative.
- **Raw `<textarea>`s (5 sites) were NOT migrated**: they span two visual specs
  and DS Textarea matches neither — migration awaits one canonical decision.

## Validation

- `npx tsc --noEmit` — clean
- `npx eslint src/...` — 0 errors (1 pre-existing warning in `mentorPortal.ts`)
- `npm run build` — full pass, 31/31 static pages
- `npm run build-storybook` — success, all stories
- Repo-wide searches: zero `components/ui` references, one implementation per
  shared component, zero DS→legacy dependencies
- RTL (`dir="rtl"` + logical properties), keyboard/focus, 44px targets,
  responsive behavior — all preserved (verified by review; no interactive
  behavior was altered)

## Run it

```bash
npm install
npm run dev          # product at http://localhost:3000
npm run storybook    # design system docs at http://localhost:6006
npm run build && npm run build-storybook   # verify both
```

## Roadmap (deliberately out of scope)

Decide the canonical multiline style → align + adopt DS Textarea; align or
retire DS Avatar vs `MentorAvatar`; remove retire-candidates; add missing
ProgressBar-adjacent docs; resolve unrelated uncommitted work in the tree.
