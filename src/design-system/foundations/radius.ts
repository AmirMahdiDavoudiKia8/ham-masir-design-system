export { radius as radiusTokens, radiusSemantic as radiusSemanticTokens } from "./spacing";
/** Pixel values — mirror of tokens.css primitives. sm/md/lg preserved. */
export const radii = { none: 0, xs: 4, sm: 12, md: 16, lg: 20, xl: 24, "2xl": 32, full: 9999 } as const;
/** Semantic radius → primitive step. Components use the key, never the px. */
export const radiusMap = {
  button: "md",
  input: "md",
  card: "lg",
  dialog: "xl",
  sheet: "xl",
  badge: "sm",
  chip: "full",
  avatar: "full",
} as const;
