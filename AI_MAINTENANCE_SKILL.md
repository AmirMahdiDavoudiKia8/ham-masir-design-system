# Ham-Masir Design System — AI Maintenance Skill & Rulebook

**Authority:** this file is the single authoritative rulebook for AI agents
working on the Ham-Masir Design System. It supersedes all older notes.
Plain `ai-instructions.md` (repo root) is only a pointer to this file.

**How to use it:** before any change, read the section that covers your task
(tokens → §5, component → §3, docs copy → §4, layout/a11y → §1–§2). After any
change, run the §5 validation gate. When in doubt, stop and ask — never guess
a token, a status, or a product decision.

---

## 1. System Identity & RTL Architecture

- **Project:** Ham-Masir (هم‌مسیر) Design System. Warm, calm, companion-like
  UI for stressed students. Companionship before functionality; space is
  trust; calm motion only (no bounce/spring); no competitive, loud, or
  corporate patterns; no blaming copy; Persian numerals in user-facing content.
- **Direction:** strictly RTL. `<html lang="fa" dir="rtl">` is set once in
  `src/app/layout.tsx`; Storybook preview mirrors it in
  `.storybook/preview.tsx` (`RtlWrapper`). Never set direction per element.
- **Logical properties ONLY.** Never use physical directional CSS or Tailwind
  classes: no `left/right`, `ml-*/mr-*`, `pl-*/pr-*`, `text-left/text-right`,
  `border-l/border-r`, `rounded-l/rounded-r`. Always use logical equivalents:
  `ms-*/me-*`, `ps-*/pe-*`, `start-/end-`, `text-start`, `border-s/border-e`,
  `inset-inline-start`, `inline-start/inline-end`. Native behaviors (e.g. the
  Textarea `resize-y` handle side) then adapt to direction automatically.
- **Latin islands stay isolated:** phone numbers, codes, token names and code
  spans render `dir="ltr"` with `unicode-bidi: isolate` (see `.font-latin`
  and the `.sbdocs code` rule) so punctuation never jumps sides inside RTL.
- **Docs parity:** `.storybook/preview.css` mirrors `globals.css`; docs
  typography rules must never restyle live story canvases (scope prose rules
  away from `.docs-story` contents).

## 2. Strict Accessibility — WCAG 2.1 AA Mandates

- **WCAG 1.4.1 (Use of Color):** never rely on color alone to convey state.
  Input/Textarea errors and Alert tones MUST combine semantic color tokens
  with an explicit icon and descriptive text. Every Alert tone renders its
  status icon (`toneIcons` in `Alert.tsx`); every field error renders icon +
  `role="alert"` text.
- **No nested interactive elements:** never place `<button>`, `<a>`, or any
  interactive control inside an interactive wrapper (e.g. a clickable `Card`
  with `role="button"`). The `Clickable` story documents this ban; passing
  `actions` together with `onClick` is a WCAG violation (event bubbling +
  screen-reader panic), not a layout choice.
- **Screen-reader integrity:**
  - Decorative icons (`startIcon`, `endIcon`, status glyphs) must carry
    `aria-hidden="true"`.
  - Toggles (`ThemeToggle`, `Chip`) must expose state via `aria-pressed`.
  - Dynamic notifications (`Toast`) must use live-region roles —
    `role="status"` (polite) for success, `role="alert"` (assertive) for
    errors — and Storybook must mount the real provider path (`showToast`).
  - Label-less visuals (`ProgressBar`) must enforce a **required**
    `ariaLabel: string` prop at the TypeScript level; every product call-site
    must pass a meaningful Persian label.
  - Form fields: `label`+`htmlFor`, `aria-invalid`, `aria-describedby`
    (hint/error), error text with `role="alert"`.
- **Keyboard & ergonomics:** every interactive element shows a clear
  `:focus-visible` ring (`ring-border-focus` + offset, same pattern as
  Button/Chip — never the decorative `primary`/`primary-light` tokens).
  Full keyboard operability (Tab order, Enter/Space activation).
  Minimum tap target 48px. Overlays (`Sheet`) must support Escape dismissal,
  backdrop click, and mobile swipe-to-dismiss.

## 3. Component Architecture & TypeScript Standards

- **One folder per component** (`Component.tsx` + `index.ts` + `*.stories.tsx`;
  feedback primitives may share the `Feedback/` folder with one file each,
  re-exported from its `index.ts`). Never import across components except
  through the barrel (`src/design-system/index.ts`).
- **Inversion of Control (IoC):** containers like `EmptyState` accept
  `ReactNode` slots (`action?: ReactNode`) instead of hardcoding buttons or
  business logic.
- **Separation of concerns:** keep declarative in-flow components (`Alert`)
  separate from imperative portal-based ones (`Toast`); group both logically
  under `FEEDBACK` in Storybook navigation.
- **Role contracts (enforced, not suggested):** Button = the only action;
  Chip = the only toggle (`aria-pressed`); Tag = non-interactive
  categorization (single peach tint, no hover); Badge = status via feedback
  triples with visible border. Never let them resemble each other.
- **Strict type-safety for docs:** explicitly type HTML primitive attributes
  (`rows?: number` in Textarea, clamped 0–100 `value` in ProgressBar) so
  Storybook ArgsTable renders accurate controls (number/range), never generic
  object buttons. Never ship malformed type strings (e.g. `ReactReactNode`).
- **Token scalability:** pill shapes use the `full` (9999px) radius token
  (`rounded-chip`, `rounded-badge`) — never fixed-pixel radii that deform on
  text growth.
- **Token discipline:** semantic classes only (`bg-action-primary`,
  `text-foreground`, `border-border-focus`…); zero hex/`rgb()`/arbitrary
  colors; zero `dark:` overrides (the semantic layer flips automatically);
  zero arbitrary pixels (`min-w-[44px]`, `border-[1.5px]`); motion/durations
  from tokens only; `transition-colors` (or a named property), never
  `transition-all`; no `scale` press effects.
- **Know your `cn()`:** it is a plain join, NOT tailwind-merge — conflicting
  classes both apply. Keep base strings layout-only; put all color/border
  decisions in the variant/tone maps.
- **Status taxonomy (load-bearing):** `canonical` = shipped, safe to use;
  `proposal` = reserve, not adopted; `beta` = incomplete; `pending-decision`
  = superseded in product, verdict open. File existence never implies
  production-readiness. Deleted for zero usage: Checkbox, Divider,
  VerifiedBadge. Merged into `Surfaces.mdx`: Radius/Borders/Shadows docs.
- **Icons:** one stroke family (1.75px, 24 viewBox, round caps) in
  `icons.tsx`. New icons go here — never one-off inline SVGs.

## 4. UX Writing & Documentation-as-Code (فارسی)

- **لحن:** strictly formal, precise, engineering-grade Persian. No humor, no
  poetry, no second-person chatter in docs.
- **الگوهای ممنوع (هرگز استفاده نشود):** افعال محاوره‌ای («صدا بزنی»،
  «نگه‌دار»، «نمی‌پراند»، «شماره رو وارد کن»، «می‌ذاره»، «ببینیشون»)،
  استعاره‌های شاعرانه («Night Walk»، «اعلان آرام»)، و ترجمه‌های ماشینی تحت‌اللفظی
  («قرص» برای Chip، «تیک‌زن» برای Checkbox، «باز کردن شیت» برای Sheet).
- **واژه‌نامه‌ی مصوب:**

  | Term | Persian (formal) |
  |---|---|
  | Chip | چیپ (فیلتر تعاملی) |
  | Tag | تگ / برچسب وضعیت (غیرتعاملی / Read-only) |
  | Checkbox | چک‌باکس |
  | Input / Textarea | فیلد ورودی متن / فیلد متنی چندخطی |
  | Alert | کامپوننت اعلان (دارای وضعیت‌های معنایی / Semantic Tones) |
  | Toast | اعلان گذرا (تُست) |
  | Sheet | پنل کشویی پایین‌صفحه (Bottom Sheet) |
  | Skeleton | اسکلت‌بندی بارگذاری (جهت جلوگیری از پرش چیدمان / CLS) |

- **Zero untranslated strings:** every prop description and story note in
  Storybook must be fully translated into formal Persian. Prop/type *names*
  stay English; Latin token names and code stay LTR-isolated.
- **RTL در داک:** تیترها و پاراگراف‌های فارسی راست‌چین؛ اعداد نمایشی کاربر
  فارسی (۱۲۳)؛ کدها و نام توکن‌ها LTR و ایزوله.

## 5. Token Source of Truth & Validation Gate

- **Canonical:** `src/design-system/tokens/tokens.css` (primitives →
  semantic `:root` + `.dark`). Mirrors: `tokens.json`, `src/lib/tokens.ts`.
  Binding only: `tailwind.config.ts`. Dead: `src/styles/tokens.css`
  (deprecated shim — never add values, never source from it).
- **Run before finishing (all must pass):**
  ```bash
  npx tsc --noEmit -p tsconfig.json
  npx eslint src/design-system/ .storybook/
  npm run storybook        # http://localhost:6006 — check light + dark (Mood toolbar)
  ```
  (`npm run lint` on the whole repo also lints build output — use the scoped
  form above as the gate. `npm run build-storybook` for release builds.)
- **Per-change quality gate:** RTL parity · keyboard `:focus-visible` ·
  AA contrast in both themes (text ≥ 4.5:1, boundaries ≥ 3:1) · no pure
  black/white, neon, harsh red, or aggressive gradients.
- **Git policy:** this checkout versions the design system only
  (`src/features/` is intentionally ignored). Never touch `.gitignore` to
  include app files, never force-add ignored files, never commit without
  explicit approval.
