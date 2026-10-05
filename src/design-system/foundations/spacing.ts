/** Foundations: spacing scale (4-based). Gutters 20–24, min gap 16, tap target ≥48. */
export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64] as const;
/** Primitive radius steps → Tailwind rounded-*. Values mirror tokens.css. */
export const radius = {
  none: "rounded-none",
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
} as const;
/** Semantic radius aliases → Tailwind rounded-*. Prefer these in components. */
export const radiusSemantic = {
  button: "rounded-button",
  input: "rounded-input",
  card: "rounded-card",
  dialog: "rounded-dialog",
  sheet: "rounded-sheet",
  badge: "rounded-badge",
  chip: "rounded-chip",
  avatar: "rounded-avatar",
} as const;
/** Elevation + semantic shadows → Tailwind shadow-*. */
export const shadows = {
  none: "shadow-none",
  card: "shadow-card",
  dropdown: "shadow-dropdown",
  popover: "shadow-popover",
  dialog: "shadow-dialog",
  sheet: "shadow-sheet",
  floating: "shadow-floating",
  lifted: "shadow-lifted",
  brand: "shadow-brand",
} as const;
