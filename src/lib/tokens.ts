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
    name: "Pinar (Vazirmatn RD)",
    family: '"Vazirmatn RD", "Pinar", Tahoma, sans-serif',
    weights: "Bold / SemiBold — headings, page titles",
    example: "مسیرت رو تنها نرو",
  },
  body: {
    name: "Body (Vazirmatn RD Regular)",
    family: '"Vazirmatn RD", Tahoma, sans-serif',
    weights: "Regular / Medium — descriptions, paragraphs, inputs",
    example: "با کسی که راهِ تو را رفته — هر روز یه شروعِ تازه‌ست. بیا از همین‌جا ادامه بدیم.",
  },
} as const;

export const tokens = { colors, fontSizes, fonts };

export default tokens;
