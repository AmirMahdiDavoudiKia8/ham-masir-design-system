# Ham-Masir Design System

A token-driven, reusable UI foundation for Ham-Masir — built like [Sakani Design System](https://github.com/samzydd/Sakani-design-system) (structure adapted with attribution, MIT), branded entirely Ham-Masir.

> Status words below are load-bearing: **canonical** = shipped in product and
> safe to use; **proposal** = reserve, not adopted; **beta (WIP)** = incomplete
> (no stories); **pending-decision** = superseded in product, awaiting merge or
> adopt verdict. Presence of a file never implies production-readiness.

## What's in here

- **Design tokens** — 3 layers in `tokens/tokens.css` (+ `tokens.json`):
  1. Primitives (teal / peach / cream / ink ramps), 2. Semantic (light + `.dark`),
  3. Components bind ONLY to semantic tokens. Single import at app root.
- **Foundations** (`foundations/`) — Colors, Surfaces (also covers radius,
  borders, elevation), Typography, Spacing, Motion, Icons. Each area: `*.ts`
  module + `*.mdx` docs. Barrel: `foundations/index.ts`.
- **15 component folders** (`components/*/`) — each: `Component.tsx` +
  `index.ts` (+ `*.stories.tsx` except MentorCard), variant/size/state axes,
  JSDoc with `Status`, RTL, focus rings, Persian numerals.
- **Icons** (`icons.tsx`) — single-stroke family (1.75px, 24 viewBox).
  New icons go here, never as one-off inline SVGs.
- **Blocks** (`blocks/`) — composition examples (MentorCard), not components.
- **Barrel** (`index.ts`) — one public entry point.
- **Storybook** (`.storybook/`, `*.stories.tsx`) — one story file per
  component with controls, autodocs and dark-mode stories.
  Run `npm run storybook` → http://localhost:6006.
- **AI rules** (`ai-instructions.md`, repo root) — token source, scopes,
  quality gate for agents.

## Component inventory (by Status)

| Component | Status | Notes |
|---|---|---|
| Button, Input, Textarea, Badge, Card, Chip, EmptyState, ThemeToggle, Tag, Sheet, Toast, ProgressBar | canonical | Shipped in product flows; Textarea adopted (mentor-portal, request-mentor, session-cancel) |
| Avatar | pending-decision | Product uses feature-level `MentorAvatar` instead; adopt-or-merge verdict open |
| MentorCard | beta (WIP) | No stories; shell unrendered — only MentorTile + `mentorCardClasses` recipe are canonical |
| Alert, Spinner, Skeleton | proposal | Docs demos only; zero product imports |

Removed (zero product usage, no stories): Checkbox, Divider, VerifiedBadge.
Merged into `Surfaces.mdx` (files deleted): Radius, Borders, Shadows docs.

## Token sources — roles

| File | Role |
|---|---|
| `src/design-system/tokens/tokens.css` | **CANONICAL.** All values; `:root` + `.dark`. Edit here. |
| `src/design-system/tokens/tokens.json` | Typed mirror for tooling/docs. Mirror CSS changes here. |
| `src/lib/tokens.ts` | Typed mirror for docs + code (names/hex/usage). Never import hexes into components. |
| `tailwind.config.ts` | Binding only: maps classes to `var(--…)`. Never hard-code values. |
| `src/styles/tokens.css` | **DEPRECATED shim** (re-exports canonical). Never add values. |

## Principles (from the brand)

- One primary action per screen; secondary is outline.
- Semantic naming: `pending / confirmed / cancelled`, not colors.
- Composite over duplicate: MentorCard = Card + Avatar + content rules.
- Whole card is the tap target; bio stays off the card.
- Calm by default: soft shadows, gentle motion, no bounce.
- Feedback ships as bg + text + border + icon, never color alone.

## Run & validate (repo scripts only)

```bash
npm run storybook        # design-system review → http://localhost:6006
npm run build-storybook  # static build into storybook-static/
npm run lint             # eslint
npx tsc --noEmit -p tsconfig.json   # typecheck (no excerpt: full project)
```

Quality gate per change: RTL parity, keyboard `:focus-visible`, AA contrast
in light + dark (Mood toolbar). No pure black/white, neon, harsh red,
or aggressive gradients.
