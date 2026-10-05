/** Foundations: typography roles (Estedad, RTL, generous Persian leading).
 *  Legacy roles preserved; v2 completes display / h4–h6 / body-lg·sm /
 *  label-lg·sm / overline. Weights limited to shipped files (400–700). */
export const typography = {
  display: "text-display font-bold",
  displayMd: "text-display-md font-bold",
  displayLg: "text-display-lg font-bold",
  displayMdFluid: "text-display-md-fluid font-bold",
  displayLgFluid: "text-display-lg-fluid font-bold",
  h1: "text-h1 font-bold",
  h2: "text-h2 font-semibold",
  h3: "text-h3 font-semibold",
  h4: "text-h4 font-semibold",
  h5: "text-h5 font-semibold",
  h6: "text-h6 font-semibold",
  bodyLg: "text-body-lg font-normal",
  body: "text-body font-normal",
  bodySm: "text-body-sm font-normal",
  caption: "text-caption font-normal text-muted-foreground",
  labelLg: "text-label-lg font-medium",
  label: "text-label font-medium",
  labelSm: "text-label-sm font-medium",
  overline: "text-overline font-semibold text-muted-foreground",
} as const;
export type TypeRole = keyof typeof typography;

/** Allowed weights — exactly the shipped Estedad files. Never 800/900. */
export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;
export type FontWeightName = keyof typeof fontWeights;
