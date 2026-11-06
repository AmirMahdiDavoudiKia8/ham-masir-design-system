# Hamotaghi — redesign & design-system hardening

## Scope
- Reviewed `/` and `/design-system`, every design-system component, tokens, theme, ESLint config and docs.
- Rebuilt the two pages with the design system, preserving their structure and behavior.
- Made the “everything comes from tokens” claim enforceable instead of aspirational.
- No backend work; original `hamotaghi-web.zip` was not touched.

## Token layer
`src/design-system/tokens.ts`
- Added semantic brand roles: `brand.tint`, `brand.soft`.
- Added accessible status roles:
  - `statusText.success/warning/error/info` — AA text (5.21–7.09:1 on the matching light surfaces).
  - `statusStroke.success/warning/error/info` — ≥3:1 graphics for rings, icons and borders.
- Added `borderWidth.hairline/thick`.
- Added `size` tokens for avatars, icons, empty state, icon badge, mobile frame and match score.
- Added `rootFontSize` so rem→px display is token-derived.
- Added darker green/red/amber scale steps used by the accessible roles.

`src/design-system/theme.ts`
- Wired status text/stroke roles into Alert, helper text, input labels, error buttons and the required-priority toggle.
- Tokenized border widths, progress height, toggle padding/gap, avatar type size.
- Alert text/icons now meet AA / 3:1 instead of using the bright Figma 500 colors.
- Error contained button uses `#B91C1C` (white text = 6.47:1).

## Components
- `WelcomeBox` / `IconBadge`: semantic brand surfaces instead of raw `colorScale`.
- `MatchScore`: text uses `statusText`, ring uses `statusStroke`.
- `StatusChip`: text/stroke split, including a neutral locked state.
- `ValidationChip`, `OtpInput`, `PillField`: accessible status colors and proper `aria-invalid` / `aria-describedby`.
- `MatchCard`, `StatCard`, `EmptyState`, `MobileFrame`: fixed dimensions moved to `tokens.size`; `MobileFrame` gained `titleComponent` so gallery frames use `h2` while the real app keeps `h1`.
- Added `PillSelect`: same label-above layout and capsule outline as `PillField`, so selects no longer look like stock MUI controls.
- Re-exported `statusText` / `statusStroke` from the public `@/design-system` API.

## Pages
- `/`: kept the header + design-system CTA, added a real DS-based landing page (stat cards, token rule explanation, quick-start card, info alert). All values are theme/tokens.
- `/design-system`: preserved every section and interaction (colors, surfaces, typography, spacing/radius/shadow, buttons, forms, feedback, UI kit, three Figma mobile screens, domain components, admin panel). Removed raw radii/dimensions; fixed the typography column after discovering numeric `width` is raw px in MUI `sx`; forms now use `PillField` + `PillSelect`. Input values stay Latin per FIGMA_SPEC; display text uses Persian digits.

## Guardrails
`eslint.config.mjs` now errors (outside `src/design-system/**`) on:
- hex / rgb / hsl colors
- `fontFamily`
- `fontSize`
- numeric `fontWeight`
- `lineHeight`
- string shadows
- numeric, px, or fixed-template `borderRadius`
- `createTheme` / `ThemeProvider` imports, DS subpath imports, Tailwind

A 10-violation probe produced 10 errors; `borderRadius: 0` and `boxShadow: 1` were correctly allowed.

## Verification
- `npm run lint` — 0 errors
- `npm run typecheck` — 0 errors
- `npm run build` — static `/` and `/design-system` built successfully
- Visible font sizes on `/design-system`: 11, 13, 14, 15, 16, 19, 24px only
- No console errors
- No horizontal overflow at 1280px or 375px
- Interactions tested: auth tab switch, OTP typing, priority picker, password reveal, select menu, home CTA
- Computed accessible colors verified:
  - success text `#047857`, warning `#92400E`, error `#B91C1C`, info `#1D4ED8`
  - success stroke `#059669`, warning `#D97706`, error `#DC2626`, info `#3B82F6`

## Artifacts
- Working project: `C:\Users\Techramz.co\Desktop\Hamotaghi\hamotaghi-redesigned\project`
- Redesigned zip: `C:\Users\Techramz.co\Desktop\Hamotaghi\hamotaghi-redesigned\hamotaghi-web-redesigned.zip`
- Before/after gallery: `C:\Users\Techramz.co\Desktop\Hamotaghi\hamotaghi-redesigned\before-after.html`
- Screenshots: `C:\Users\Techramz.co\Desktop\Hamotaghi\hamotaghi-redesigned\screenshots\`
- Original deliverable (untouched): `C:\Users\Techramz.co\Desktop\Hamotaghi\hamotaghi-web.zip`
