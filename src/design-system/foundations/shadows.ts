export { shadows as shadowTokens } from "./spacing";
/** Raw elevation values (light) — mirror of tokens.css. */
export const shadowValues = {
  "elevation-0": "none",
  "elevation-1": "0 1px 3px rgba(44,58,56,0.06)",
  "elevation-2": "0 2px 8px rgba(44,58,56,0.06), 0 8px 24px rgba(44,58,56,0.05)",
  "elevation-3": "0 8px 40px rgba(44,58,56,0.12)",
  "elevation-4": "0 16px 56px rgba(44,58,56,0.18)",
  brand: "0 8px 20px rgba(91,158,148,0.22)",
} as const;
/** Semantic shadow → elevation level. */
export const shadowMap = {
  card: "elevation-2",
  dropdown: "elevation-3",
  popover: "elevation-3",
  dialog: "elevation-4",
  sheet: "elevation-4",
  floating: "elevation-3",
  lifted: "elevation-3",
  brand: "brand",
} as const;
