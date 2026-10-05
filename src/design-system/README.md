# Ham-Masir Design System

A token-driven, reusable UI foundation for Ham-Masir — built like [Sakani Design System](https://github.com/samzydd/Sakani-design-system) (structure adapted with attribution, MIT), branded entirely Ham-Masir.

## What's in here

- **Design tokens** — 3 layers in `tokens/tokens.css` (+ `tokens.json`):
  1. Primitives (teal / peach / cream / ink ramps), 2. Semantic (light + `.dark`),
  3. Components bind ONLY to semantic tokens. Single import at app root.
- **Foundations** (`foundations/`) — colors, typography, spacing, radius, shadows, motion.
- **8 components** (`components/*/`) — Button, Input, Textarea, Badge, Avatar,
  Checkbox, Card, MentorCard. Each folder: `Component.tsx` + `index.ts`, Sakani-pattern
  variant/size/state axes, JSDoc, RTL, focus rings, Persian numerals.
- **Blocks** (`blocks/`) — composition examples (MentorCard), not over-configured components.
- **Barrel** (`index.ts`) — one public entry point.
- **Storybook** (`.storybook/`, `*.stories.tsx`) — Sakani-pattern visual review:
  one story file per component with controls, autodocs, variant/size matrices
  and dark-mode stories. Run `npm run storybook` → http://localhost:6006.

## Principles (from the brand)

- One primary action per screen; secondary is outline.
- Semantic naming: `pending / confirmed / cancelled`, not colors.
- Composite over duplicate: MentorCard = Card + Avatar + content rules.
- Whole card is the tap target; bio stays off the card.
- Calm by default: soft shadows, gentle 340ms motion, no bounce.

## Run

```bash
npm run storybook   # opens Storybook at http://localhost:6006
```
