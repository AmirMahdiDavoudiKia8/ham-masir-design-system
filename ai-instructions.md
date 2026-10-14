# AI Instructions — Ham-Masir Design System

Strict rules for any AI agent working in this repo. Violating them breaks the
audit trail; when in doubt, stop and ask.

## 1. SSoT — read tokens from ONE file

All global design tokens MUST be read exclusively from:

```
src/design-system/tokens/tokens.css   ← CANONICAL SOURCE OF TRUTH
```

- Three layers: primitives → semantic (`:root` + `.dark`) → components.
- Components bind ONLY to semantic Tailwind classes (`bg-action-primary`,
  `text-foreground`, `border-border-focus`, …) which resolve to `var(--…)`.
- Never hard-code colors, spacing, radii, shadows, type, or motion in
  components — reference tokens. Hex lives in `tokens.css` (and its typed
  mirror `tokens.json`) and nowhere else.

## 2. Deprecation — the old tokens path is dead

```
src/styles/tokens.css   ← DEPRECATED shim, re-exports the file above
```

- NEVER use it as a token source. NEVER add values to it.
- (Known stale comment: `tailwind.config.ts` header still names this path;
  the code itself correctly reads `var(--…)` — fix the comment, not the wiring.)

## 3. Modification scope — where fixes go

- Component visual fixes: ONLY in `src/design-system/components/*/*.tsx`
  (plus their `*.stories.tsx` for demos/docs).
- Token/type/radius/motion changes: ONLY in
  `src/design-system/tokens/tokens.css` (+ the `tokens.json` mirror).
- Docs live next to code (`foundations/*.mdx`, `Introduction.mdx`); if you
  change a component or token, update its docs in the same pass.
- Storybook shell (`.storybook/`) mirrors `src/app/globals.css` +
  `src/app/layout.tsx` — never invent a third styling source.

## 4. Quality gate — verify before finalizing

Every change MUST pass all three before it is done:

1. **RTL** — `dir="rtl"` inherited from `<html>`; use logical properties
   (`ps-/pe-`, `start-/end-`); Latin islands (`dir="ltr"`, phone numbers,
   codes) stay isolated; user-facing numbers in Persian digits.
2. **Keyboard focus** — visible `:focus-visible` ring (`ring-border-focus`
   + offset, matching Button/Chip); full keyboard operability; no
   mouse-only interactions.
3. **Dark Mode contrast** — toggle the Mood toolbar; text pairs must stay AA
   (normal text ≥ 4.5:1, boundaries ≥ 3:1); never pure black/white, neon,
   harsh red, or aggressive gradients.

Verification commands:

```bash
npx tsc --noEmit -p tsconfig.json   # must pass clean
npm run storybook                   # http://localhost:6006 — check light + dark
```

Brand laws (non-negotiable): companionship before functionality, calm motion
only (no bounce/spring), whitespace is trust, no competitive/trophy language,
no blaming copy, Persian numerals in user-facing content.
