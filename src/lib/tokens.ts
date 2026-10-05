/**
 * lib/tokens — typed mirror of the Ham-Masir design tokens.
 *
 * Canonical values live in `src/design-system/tokens/tokens.css`
 * (primitives → semantic → component). This file exists so docs
 * (Storybook FOUNDATIONS) and code can import names + hex + the
 * short story behind each color without parsing CSS.
 *
 * Rule: if you change a hex here, change it in tokens.css too.
 * Components must still bind to semantic Tailwind classes
 * (bg-primary, text-foreground, …) — never import these hexes.
 */

export interface TokenColor {
  /** Semantic name used across the app (Tailwind: bg-primary, …). */
  name: string;
  /** Display label: role + plain-English hue. */
  label: string;
  /** Canonical light-mode hex (matches tokens.css primitives). */
  hex: string;
  /** Short story — taken from the tokens.css comments. */
  description: string;
}

/**
 * Six hero colors, in story order: the mentor, the student,
 * the paper they meet on, the anchor, then the two calm signals.
 */
export const colors: TokenColor[] = [
  {
    name: "primary",
    label: "primary — sage teal",
    hex: "#5b9e94",
    description:
      "sage teal — the leader, the mentor who has walked the path. Trust, calm, guidance. Primary actions, verified accents.",
  },
  {
    name: "secondary",
    label: "secondary — warm peach",
    hex: "#e8b99a",
    description:
      "warm peach — the companion, the student. Warmth, humanity, welcome. Secondary tints, soft highlights.",
  },
  {
    name: "background",
    label: "background — warm cream",
    hex: "#f6f1e9",
    description:
      "warm cream — openness, breathing room. The paper everything rests on; space is trust.",
  },
  {
    name: "ink",
    label: "ink — deep teal-charcoal",
    hex: "#2c3a38",
    description:
      "deep teal-charcoal — the anchor. Replaces navy, never pure black. Primary text, quiet strength.",
  },
  {
    name: "warning",
    label: "warning — warm amber",
    hex: "#d99a6c",
    description:
      "warm amber — behind on plan, needs attention. A warm nudge from the peach family, never a harsh red.",
  },
  {
    name: "danger",
    label: "danger — muted terracotta",
    hex: "#b0644f",
    description:
      "muted terracotta — true errors only. Calm and specific, never a screaming red.",
  },
];

export interface TokenFontSize {
  name: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  /** Rendered size. */
  size: string;
  /** Which type role it maps to in tokens.css. */
  role: string;
  /** Suggested use. */
  usage: string;
}

/** Body scale xs → 2xl, mapped to the canonical type roles. */
export const fontSizes: TokenFontSize[] = [
  { name: "xs", size: "12px", role: "label", usage: "micro labels, buttons (sm)" },
  { name: "sm", size: "13px", role: "caption", usage: "captions, hints, secondary text" },
  { name: "base", size: "16px", role: "body", usage: "body copy, inputs — the reading size" },
  { name: "lg", size: "17px", role: "h3", usage: "card titles, section heads" },
  { name: "xl", size: "20px", role: "h2", usage: "section titles" },
  { name: "2xl", size: "24px", role: "h1", usage: "page titles" },
];

export const fonts = {
  display: {
    name: "Estedad Bold",
    family: '"Estedad", Tahoma, sans-serif',
    weights: "Bold / SemiBold — headings, page titles",
    example: "مسیرت رو تنها نرو",
  },
  body: {
    name: "Estedad Regular",
    family: '"Estedad", Tahoma, sans-serif',
    weights: "Regular / Medium — descriptions, paragraphs, inputs",
    example: "با کسی که راهِ تو را رفته — هر روز یه شروعِ تازه‌ست. بیا از همین‌جا ادامه بدیم.",
  },
} as const;

export const tokens = { colors, fontSizes, fonts };

export default tokens;

/* ------------------------------------------------------------------ */
/* Surfaces: radius / border-width / elevation (docs + review checklist). */
/* Canonical values live in tokens.css; Tailwind classes are the binding. */
/* ------------------------------------------------------------------ */

export interface SurfaceRadius {
  token: string;
  cssVar: string;
  px: number;
  tailwind: string;
  usage: string;
}

export const radii: SurfaceRadius[] = [
  { token: "none", cssVar: "--radius-none", px: 0, tailwind: "rounded-none", usage: "Sharp edge only when required (flush handles, fills)." },
  { token: "xs", cssVar: "--radius-xs", px: 4, tailwind: "rounded-xs", usage: "Small decorative elements, checkbox box." },
  { token: "sm", cssVar: "--radius-sm", px: 12, tailwind: "rounded-sm", usage: "Compact controls, badges." },
  { token: "md", cssVar: "--radius-md", px: 16, tailwind: "rounded-md", usage: "Buttons, inputs — the standard control radius." },
  { token: "lg", cssVar: "--radius-lg", px: 20, tailwind: "rounded-lg", usage: "Cards and panels." },
  { token: "xl", cssVar: "--radius-xl", px: 24, tailwind: "rounded-xl", usage: "Dialogs, sheets — prominent containers." },
  { token: "2xl", cssVar: "--radius-2xl", px: 32, tailwind: "rounded-2xl", usage: "Large expressive surfaces." },
  { token: "full", cssVar: "--radius-full", px: 9999, tailwind: "rounded-full", usage: "Pills, chips, avatars, circular elements." },
];

export const radiusSemantic = [
  { token: "button", cssVar: "--radius-button", ref: "md", tailwind: "rounded-button", usage: "All buttons." },
  { token: "input", cssVar: "--radius-input", ref: "md", tailwind: "rounded-input", usage: "Inputs, textareas, selects." },
  { token: "card", cssVar: "--radius-card", ref: "lg", tailwind: "rounded-card", usage: "Cards, alerts, panels." },
  { token: "dialog", cssVar: "--radius-dialog", ref: "xl", tailwind: "rounded-dialog", usage: "Dialogs and prominent overlays." },
  { token: "sheet", cssVar: "--radius-sheet", ref: "xl", tailwind: "rounded-sheet", usage: "Bottom sheets (top corners)." },
  { token: "badge", cssVar: "--radius-badge", ref: "sm", tailwind: "rounded-badge", usage: "Badges." },
  { token: "chip", cssVar: "--radius-chip", ref: "full", tailwind: "rounded-chip", usage: "Chips, pills." },
  { token: "avatar", cssVar: "--radius-avatar", ref: "full", tailwind: "rounded-avatar", usage: "Avatars." },
];

export const borderWidths = [
  { token: "hairline", cssVar: "--border-width-hairline", px: 1, tailwind: "border", usage: "Hairlines, dividers, card boundaries." },
  { token: "medium", cssVar: "--border-width-medium", px: 1.5, tailwind: "border-medium", usage: "Emphasized control outlines (rare)." },
  { token: "strong", cssVar: "--border-width-strong", px: 2, tailwind: "border-strong", usage: "Featured selections only (e.g. MentorCard strip)." },
];

export const elevations = [
  { level: 0, cssVar: "--elevation-0", tailwind: "shadow-none", usage: "Default. Border + surface contrast carry hierarchy." },
  { level: 1, cssVar: "--elevation-1", tailwind: "shadow-card*", usage: "Subtle separation (hover lift on flat cards)." },
  { level: 2, cssVar: "--elevation-2", tailwind: "shadow-card", usage: "Standard card elevation (resting floating tiles)." },
  { level: 3, cssVar: "--elevation-3", tailwind: "shadow-floating / shadow-dropdown / shadow-popover", usage: "Floating surfaces: dropdowns, popovers, FABs." },
  { level: 4, cssVar: "--elevation-4", tailwind: "shadow-dialog / shadow-sheet", usage: "Dialogs, sheets, prominent overlays." },
];

/* ------------------------------------------------------------------ */
/* v2 — full typography scale (type system).                           */
/* `fontSizes`/`fonts` above are the preserved public API. Below: the  */
/* complete tier table, weight allowlist, and RTL rules for docs.      */
/* ------------------------------------------------------------------ */

/** One typography tier: token names, metrics, and product guidance. */
export interface TypeTier {
  tier: string;
  token: string;
  tailwind: string;
  size: string;
  weight: string;
  leading: number;
  tracking: string;
  usage: string;
  responsive: string;
}

export const typeScale: TypeTier[] = [
  { tier: "Display Large", token: "--text-display-lg", tailwind: "text-display-lg / text-display-lg-fluid", size: "40px", weight: "Bold 700", leading: 1.2, tracking: "0", usage: "Landing hero, campaign moments. One per screen max.", responsive: "Fluid 32→40 via clamp; fixed 40 only above lg." },
  { tier: "Display Medium", token: "--text-display-md", tailwind: "text-display-md / text-display-md-fluid", size: "34px", weight: "Bold 700", leading: 1.25, tracking: "0", usage: "Page heroes (find-mentors, planner result).", responsive: "Fluid 30→34 via clamp." },
  { tier: "Display Small", token: "--text-display", tailwind: "text-display", size: "30px", weight: "Bold 700", leading: 1.25, tracking: "0", usage: "Section heroes, empty-state titles. Legacy anchor, fixed.", responsive: "Fixed — steps down to md-fluid on small screens." },
  { tier: "Heading 1", token: "--text-h1", tailwind: "text-h1", size: "24px", weight: "Bold 700", leading: 1.3, tracking: "0", usage: "Page titles (one h1 per page).", responsive: "Fixed." },
  { tier: "Heading 2", token: "--text-h2", tailwind: "text-h2", size: "20px", weight: "SemiBold 600", leading: 1.35, tracking: "0", usage: "Section titles.", responsive: "Fixed." },
  { tier: "Heading 3", token: "--text-h3", tailwind: "text-h3", size: "17px", weight: "SemiBold 600", leading: 1.4, tracking: "0", usage: "Card titles, dialog titles.", responsive: "Fixed." },
  { tier: "Heading 4", token: "--text-h4", tailwind: "text-h4", size: "16px", weight: "SemiBold 600", leading: 1.5, tracking: "0", usage: "Calm section heads — body size, weight carries hierarchy.", responsive: "Fixed." },
  { tier: "Heading 5", token: "--text-h5", tailwind: "text-h5", size: "14px", weight: "SemiBold 600", leading: 1.6, tracking: "0", usage: "Dense list heads, form section heads.", responsive: "Fixed." },
  { tier: "Heading 6", token: "--text-h6", tailwind: "text-h6", size: "13px", weight: "SemiBold 600", leading: 1.6, tracking: "0", usage: "Eyebrow-adjacent heads; caption size + weight.", responsive: "Fixed." },
  { tier: "Body Large", token: "--text-body-lg", tailwind: "text-body-lg", size: "18px", weight: "Regular 400", leading: 1.75, tracking: "0", usage: "Landing intros, mentor bio ledes.", responsive: "Fixed — never shrinks (readability)." },
  { tier: "Body Medium", token: "--text-body", tailwind: "text-body", size: "16px", weight: "Regular 400", leading: 1.7, tracking: "0", usage: "Default reading size: paragraphs, inputs, mentor cards.", responsive: "Fixed." },
  { tier: "Body Small", token: "--text-body-sm", tailwind: "text-body-sm", size: "14px", weight: "Regular 400", leading: 1.7, tracking: "0", usage: "Secondary copy, checkbox labels, dense help.", responsive: "Fixed." },
  { tier: "Label Large", token: "--text-label-lg", tailwind: "text-label-lg", size: "14px", weight: "Medium 500", leading: 1.6, tracking: "0", usage: "Emphasized controls, tab labels.", responsive: "Fixed." },
  { tier: "Label Medium", token: "--text-label", tailwind: "text-label", size: "12px", weight: "Medium 500", leading: 1.5, tracking: "0", usage: "Buttons (sm), badges, dividers. Legacy anchor.", responsive: "Fixed." },
  { tier: "Label Small", token: "--text-label-sm", tailwind: "text-label-sm", size: "11px", weight: "Medium 500", leading: 1.5, tracking: "0", usage: "Counts / metadata ONLY — never essential or actionable text.", responsive: "Fixed — never smaller." },
  { tier: "Caption", token: "--text-caption", tailwind: "text-caption", size: "13px", weight: "Regular 400", leading: 1.6, tracking: "0", usage: "Hints, helper text, form labels, secondary info.", responsive: "Fixed." },
  { tier: "Overline", token: "--text-overline", tailwind: "text-overline", size: "12px", weight: "SemiBold 600", leading: 1.5, tracking: "0", usage: "Kickoff labels above headings. SemiBold + muted, never caps/tracking on Persian.", responsive: "Fixed." },
];

/** Allowed weights — exactly the shipped Estedad woff2 files. */
export const typeWeights = [
  { name: "Regular", value: 400, file: "Estedad-Regular.woff2", usage: "Body, captions — the reading voice." },
  { name: "Medium", value: 500, file: "Estedad-Medium.woff2", usage: "Labels, badges — quiet emphasis." },
  { name: "SemiBold", value: 600, file: "Estedad-SemiBold.woff2", usage: "Headings h2–h6, control labels." },
  { name: "Bold", value: 700, file: "Estedad-Bold.woff2", usage: "Display, h1, buttons, key numbers." },
];

/** Persian/RTL rules enforced by the system (docs + review checklist). */
export const rtlRules = [
  { rule: "dir=rtl lives on <html> only", detail: "Set once in app/layout.tsx (lang=fa). Never sprinkle direction on every element; islands opt out with dir=\"ltr\"." },
  { rule: "Logical properties, not left/right", detail: "ps-/pe-, start-/end-, text-start, inset-inline-start. Components already comply (Input icons, gaps)." },
  { rule: "Latin islands use dir=\"ltr\"", detail: "Phone numbers, handles (@hammasirsite), reserve codes, step counters. Block/code islands may use .font-latin (Tahoma + isolate)." },
  { rule: "Persian numerals user-facing", detail: "toPersianDigits() for all user-visible numbers and dates (۰۱۲۳۴۵۶۷۸۹)." },
  { rule: "No Persian caps, no Persian tracking", detail: "Brand law. Overline is SemiBold + muted at the same size — never uppercase, never letter-spaced." },
  { rule: "Generous Persian leading", detail: "1.5–1.9 unitless (zoom-safe). Display may tighten to 1.2; body never below 1.7." },
  { rule: "Long headings wrap, never clip", detail: "text-balance on headings, text-pretty on paragraphs. No fixed heights on text containers; no nowrap+ellipsis on content." },
];

/* ------------------------------------------------------------------ */
/* v2 — full primitive scales + semantic token tables (color system).  */
/*                                                                     */
/* `colors` above is the preserved public API (six hero anchors).       */
/* Below: machine-readable scales + semantic maps + measured contrast, */
/* mirroring tokens.css / tokens.json for docs and lint rules.         */
/* Rule stays: components bind to Tailwind semantic classes, never     */
/* import hexes from here.                                             */
/* ------------------------------------------------------------------ */

/** One step of a primitive ramp. */
export interface PrimitiveStep {
  step: string;
  hex: string;
  /** Measured or documented role note. */
  note?: string;
}

export const primitives: Record<string, PrimitiveStep[]> = {
  teal: [
    { step: "50", hex: "#eef6f4" },
    { step: "100", hex: "#e3eeec" },
    { step: "200", hex: "#c6ddd9" },
    { step: "300", hex: "#9dc4bd" },
    { step: "400", hex: "#74aca3" },
    { step: "500", hex: "#5b9e94", note: "brand anchor (decorative / large-text only with white: 3.11:1)" },
    { step: "600", hex: "#46857c" },
    { step: "700", hex: "#376b64", note: "action-primary light (white 6.09:1)" },
    { step: "800", hex: "#2f5753" },
    { step: "850", hex: "#2f4a46", note: "deep well, reserved" },
    { step: "well", hex: "#3b6259", note: "lifted dark soft well (teal-200 text 4.79:1)" },
    { step: "900", hex: "#2c3a38", note: "intentional alias of ink-700 (anchor ink)" },
    { step: "950", hex: "#1d2726" },
    { step: "night-300", hex: "#93c7be", note: "dark action hover" },
    { step: "night-400", hex: "#7db8ae", note: "dark action resting" },
  ],
  peach: [
    { step: "50", hex: "#fdf5ee" },
    { step: "100", hex: "#fbeadd" },
    { step: "200", hex: "#f6d9c2" },
    { step: "300", hex: "#f0c5a5" },
    { step: "400", hex: "#e8b99a", note: "brand anchor" },
    { step: "500", hex: "#dba783" },
    { step: "600", hex: "#d99a6c", note: "intentional alias of alert-500 (anchor amber)" },
    { step: "700", hex: "#b87a4e" },
    { step: "800", hex: "#8a5c3c" },
    { step: "850", hex: "#4a3a2c", note: "dark secondary/alert soft well" },
    { step: "900", hex: "#4a2e1d", note: "secondary foreground (6.96:1 on peach-400)" },
  ],
  cream: [
    { step: "50", hex: "#fffdf8" },
    { step: "100", hex: "#fffcf6" },
    { step: "150", hex: "#f4efe4", note: "dark primary text" },
    { step: "200", hex: "#f7f4ed" },
    { step: "300", hex: "#f6f1e9", note: "brand anchor canvas" },
    { step: "400", hex: "#f3e1cb" },
    { step: "500", hex: "#f1ece0" },
    { step: "600", hex: "#e7e1d3" },
    { step: "700", hex: "#d6cdb6" },
    { step: "800", hex: "#c4b697", note: "non-text / decorative wells" },
    { step: "900", hex: "#9a8e74", note: "non-text / decorative wells" },
  ],
  ink: [
    { step: "50", hex: "#f3f5f4" },
    { step: "100", hex: "#e4e9e6" },
    { step: "200", hex: "#c6d1cb" },
    { step: "300", hex: "#9aa5a1", note: "decorative / large-text only on light (2.26:1)" },
    { step: "400", hex: "#6e7b78", note: "graphics / UI only on light (3.92:1)" },
    { step: "500", hex: "#5c6b68", note: "AA body text on light (4.97:1)" },
    { step: "600", hex: "#3d4a47" },
    { step: "700", hex: "#2c3a38", note: "brand anchor ink (10.56:1 on canvas)" },
    { step: "800", hex: "#222e2c" },
    { step: "900", hex: "#1d2726" },
  ],
  night: [
    { step: "200", hex: "#b9c4c0", note: "dark secondary text (8.14:1)" },
    { step: "300", hex: "#8b9794", note: "dark tertiary (4.83:1)" },
    { step: "700", hex: "#33413f" },
    { step: "750", hex: "#3a4a47", note: "dark raised surface" },
    { step: "800", hex: "#2a3634" },
    { step: "900", hex: "#202b29", note: "dark canvas anchor" },
    { step: "950", hex: "#161e1d", note: "dark sunken wells" },
  ],
  success: [
    { step: "50", hex: "#f0f7f1" },
    { step: "100", hex: "#e8f3ea" },
    { step: "200", hex: "#c9e2d1" },
    { step: "300", hex: "#a9cfb6" },
    { step: "400", hex: "#8fc3a5" },
    { step: "500", hex: "#6fa98c", note: "anchor; graphics / large-text only (2.42:1)" },
    { step: "600", hex: "#55836a" },
    { step: "700", hex: "#43765a", note: "AA text on light (4.70:1)" },
    { step: "800", hex: "#335844" },
    { step: "850", hex: "#2c4438", note: "dark soft well" },
    { step: "900", hex: "#22392c" },
  ],
  alert: [
    { step: "50", hex: "#fbf3ea" },
    { step: "100", hex: "#f8e9da" },
    { step: "200", hex: "#f3d8bc" },
    { step: "300", hex: "#eac193" },
    { step: "400", hex: "#e0aa7e" },
    { step: "500", hex: "#d99a6c", note: "anchor; graphics / large-text only (2.13:1)" },
    { step: "600", hex: "#c0804f" },
    { step: "700", hex: "#a06a3e" },
    { step: "800", hex: "#7d5230", note: "AA text on light (5.98:1)" },
    { step: "900", hex: "#4f3420" },
  ],
  danger: [
    { step: "50", hex: "#f9efeb" },
    { step: "100", hex: "#f5e4de" },
    { step: "200", hex: "#e6c6b9" },
    { step: "300", hex: "#d8a28e" },
    { step: "400", hex: "#cf8a73" },
    { step: "500", hex: "#b0644f", note: "anchor; boundary / large-text only (3.91:1)" },
    { step: "600", hex: "#96543f" },
    { step: "700", hex: "#7e4536", note: "AA text on light (6.69:1)" },
    { step: "800", hex: "#5f3527" },
    { step: "900", hex: "#3d231a" },
    { step: "950", hex: "#3b2620", note: "dark soft well" },
  ],
  info: [
    { step: "50", hex: "#eef4f4" },
    { step: "100", hex: "#dce9e9" },
    { step: "200", hex: "#b8d3d3" },
    { step: "300", hex: "#8cb4b5" },
    { step: "400", hex: "#659294" },
    { step: "500", hex: "#4e7779" },
    { step: "600", hex: "#3d5f61", note: "accents / boundaries (6.21:1 on canvas)" },
    { step: "700", hex: "#334e50", note: "AA text on light (7.96:1)" },
    { step: "800", hex: "#2b4142" },
    { step: "900", hex: "#1f3031" },
    { step: "950", hex: "#233837", note: "dark soft well" },
  ],
};

/** Semantic token → primitive reference + usage. `tailwind` is the class suffix. */
export interface SemanticToken {
  token: string;
  cssVar: string;
  light: string;
  dark: string;
  tailwind: string;
  usage: string;
}

export const semanticTokens: SemanticToken[] = [
  { token: "bg-canvas", cssVar: "--color-bg-canvas", light: "cream-300 #F6F1E9", dark: "night-900 #202B29", tailwind: "bg-canvas", usage: "Page background. Never pure white / never pure black." },
  { token: "bg-surface", cssVar: "--color-bg-surface", light: "cream-100 #FFFCF6", dark: "night-800 #2A3634", tailwind: "bg-surface", usage: "Cards, sheets, raised content." },
  { token: "bg-surface-raised", cssVar: "--color-bg-surface-raised", light: "cream-50 #FFFDF8", dark: "night-750 #3A4A47", tailwind: "bg-surface-raised", usage: "Popovers, lifted panels above surface." },
  { token: "bg-surface-sunken", cssVar: "--color-bg-surface-sunken", light: "cream-500 #F1ECE0", dark: "night-950 #161E1D", tailwind: "bg-surface-sunken", usage: "Wells, chips, inputs, skeletons." },
  { token: "bg-primary", cssVar: "--color-bg-primary", light: "teal-500 #5B9E94", dark: "teal-night-400 #7DB8AE", tailwind: "bg-primary", usage: "Decorative brand moments, progress fills, graphics. NOT text-bearing buttons (3.11:1)." },
  { token: "bg-secondary", cssVar: "--color-bg-secondary", light: "peach-400 #E8B99A", dark: "peach-400 #E8B99A", tailwind: "bg-secondary", usage: "Warm highlights, secondary fills." },
  { token: "bg-disabled", cssVar: "--color-bg-disabled", light: "cream-500 #F1ECE0", dark: "night-700 #33413F", tailwind: "bg-muted", usage: "Disabled fills — always with cursor + label, never color alone." },
  { token: "text-primary", cssVar: "--color-text-primary", light: "ink-700 (10.56:1)", dark: "cream-150 (12.73:1)", tailwind: "text-foreground", usage: "Headings, body. Alias of foreground." },
  { token: "text-secondary", cssVar: "--color-text-secondary", light: "ink-500 (4.97:1)", dark: "night-200 (8.14:1)", tailwind: "text-muted-foreground", usage: "Descriptions, hints, labels. Alias of muted-foreground." },
  { token: "text-tertiary", cssVar: "--color-text-tertiary", light: "ink-500 alias (4.97:1)", dark: "night-300 (4.83:1)", tailwind: "text-muted-foreground", usage: "Metadata. Intentional light-theme alias of secondary; distinct on dark." },
  { token: "text-inverse", cssVar: "--color-text-inverse", light: "cream-100", dark: "ink-900", tailwind: "text-inverse", usage: "Text on dark fills / scrims." },
  { token: "text-disabled", cssVar: "--color-text-disabled", light: "ink-300 (exempt)", dark: "night-300 (exempt)", tailwind: "text-disabled", usage: "Disabled labels only — never informative text." },
  { token: "text-link", cssVar: "--color-text-link", light: "teal-700 (5.41:1)", dark: "teal-night-400 (6.49:1)", tailwind: "text-link", usage: "Links. Always underlined, never color alone." },
  { token: "text-success", cssVar: "--color-text-success", light: "success-700 (4.70:1)", dark: "success-400 (7.31:1)", tailwind: "text-feedback-success-text*", usage: "Standalone success text. *In feedback boxes use feedback-success-text." },
  { token: "text-warning", cssVar: "--color-text-warning", light: "alert-800 (5.98:1)", dark: "alert-400 (7.10:1)", tailwind: "text-feedback-warning-text*", usage: "Standalone warning text. *In feedback boxes use feedback-warning-text." },
  { token: "text-danger", cssVar: "--color-text-danger", light: "danger-700 (6.69:1)", dark: "danger-400 (5.24:1)", tailwind: "text-feedback-danger-text*", usage: "Errors, validation text (with role=alert + icon). *In feedback boxes use feedback-danger-text." },
  { token: "text-info", cssVar: "--color-text-info", light: "info-700 (7.96:1)", dark: "info-300 (~6:1)", tailwind: "text-info", usage: "Informational text." },
  { token: "border-default", cssVar: "--color-border-default", light: "cream-600", dark: "ink-600", tailwind: "border-border", usage: "Hairlines, dividers (decorative, non-essential)." },
  { token: "border-subtle", cssVar: "--color-border-subtle", light: "cream-500", dark: "night-800", tailwind: "border-border-subtle", usage: "Faintest separators inside sunken areas." },
  { token: "border-strong", cssVar: "--color-border-strong", light: "ink-500 (5.46:1)", dark: "night-300 (4.15:1)", tailwind: "border-border-strong", usage: "Input / control boundaries (essential, ≥3:1)." },
  { token: "border-focus", cssVar: "--color-border-focus", light: "teal-500 (3.03:1)", dark: "teal-night-400", tailwind: "ring-primary", usage: "Focus ring via global :focus-visible (double-ring on surface)." },
  { token: "border-disabled", cssVar: "--color-border-disabled", light: "cream-600", dark: "ink-600", tailwind: "border-border", usage: "Disabled control outlines." },
  { token: "border-danger", cssVar: "--color-border-danger", light: "danger-500 (~4:1)", dark: "danger-400", tailwind: "border-danger", usage: "Error boundaries (essential, ≥3:1)." },
  { token: "border-success", cssVar: "--color-border-success", light: "success-600 (~4:1)", dark: "success-400", tailwind: "border-success", usage: "Success boundaries (essential, ≥3:1)." },
  { token: "action-primary", cssVar: "--color-action-primary", light: "teal-700, white 6.09:1", dark: "teal-night-400, ink-900 6.81:1", tailwind: "bg-action-primary", usage: "ONE main action per screen. Text-bearing buttons." },
  { token: "action-primary-hover", cssVar: "--color-action-primary-hover", light: "teal-800 (8.05:1)", dark: "teal-night-300", tailwind: "hover:bg-action-primary-hover", usage: "Hover state." },
  { token: "action-primary-pressed", cssVar: "--color-action-primary-pressed", light: "teal-900 (11.87:1)", dark: "teal-300 (8.07:1)", tailwind: "active:bg-action-primary-pressed", usage: "Pressed state (+ scale 0.98)." },
  { token: "action-secondary", cssVar: "--color-action-secondary", light: "peach-400, peach-900 6.96:1", dark: "same", tailwind: "bg-action-secondary", usage: "Warm secondary fills." },
  { token: "action-ghost-hover", cssVar: "--color-action-ghost-hover", light: "teal-100", dark: "teal-well #3B6259", tailwind: "hover:bg-action-ghost-hover", usage: "Ghost / outline hover wash." },
  { token: "primary-soft-foreground", cssVar: "--color-primary-soft-foreground", light: "teal-700 (5.13:1 on soft)", dark: "teal-200 #C6DDD9 (4.79:1 on well)", tailwind: "text-primary-soft-foreground", usage: "Labels on soft teal wells (Badge confirmed, Avatar fallback)." },
  { token: "feedback-success-bg", cssVar: "--color-feedback-success-bg", light: "success-50", dark: "success-800 #335844", tailwind: "bg-feedback-success-bg", usage: "Success boxes. Ships with text+border; icon + role, never color alone." },
  { token: "feedback-success-text", cssVar: "--color-feedback-success-text", light: "success-900 (10.91:1)", dark: "success-200 (5.83:1)", tailwind: "text-feedback-success-text", usage: "Text inside success feedback." },
  { token: "feedback-success-border", cssVar: "--color-feedback-success-border", light: "success-600 (3.98:1)", dark: "success-400 (4.01:1)", tailwind: "border-feedback-success-border", usage: "Success box boundary." },
  { token: "feedback-warning-bg", cssVar: "--color-feedback-warning-bg", light: "alert-50", dark: "peach-850", tailwind: "bg-feedback-warning-bg", usage: "Behind-on-plan nudges. Warm, never scolding." },
  { token: "feedback-warning-text", cssVar: "--color-feedback-warning-text", light: "alert-900 (10.36:1)", dark: "peach-100 (9.27:1)", tailwind: "text-feedback-warning-text", usage: "Text inside warning feedback." },
  { token: "feedback-warning-border", cssVar: "--color-feedback-warning-border", light: "alert-700 (~4.3:1)", dark: "alert-400 (5.29:1)", tailwind: "border-feedback-warning-border", usage: "Warning box boundary." },
  { token: "feedback-danger-bg", cssVar: "--color-feedback-danger-bg", light: "danger-50", dark: "danger-950", tailwind: "bg-feedback-danger-bg", usage: "True errors only. role=alert + icon." },
  { token: "feedback-danger-text", cssVar: "--color-feedback-danger-text", light: "danger-900 (12.78:1)", dark: "danger-400 (5.08:1)", tailwind: "text-feedback-danger-text", usage: "Error text incl. input validation." },
  { token: "feedback-danger-border", cssVar: "--color-feedback-danger-border", light: "danger-600 (5.11:1)", dark: "danger-400", tailwind: "border-feedback-danger-border", usage: "Error box boundary." },
  { token: "feedback-info-bg", cssVar: "--color-feedback-info-bg", light: "info-50", dark: "info-950", tailwind: "bg-feedback-info-bg", usage: "Neutral notices with a cool-calm tint." },
  { token: "feedback-info-text", cssVar: "--color-feedback-info-text", light: "info-900 (11.06:1)", dark: "info-300 (5.50:1)", tailwind: "text-feedback-info-text", usage: "Text inside info feedback." },
  { token: "feedback-info-border", cssVar: "--color-feedback-info-border", light: "info-600 (6.28:1)", dark: "info-400", tailwind: "border-feedback-info-border", usage: "Info box boundary." },
];
