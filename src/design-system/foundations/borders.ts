/** Foundations: borders — widths + semantic colors.
 *  Widths mirror tokens.css; colors bind to semantic border tokens.
 *  Use logical/physical Tailwind border utilities (border, border-t, border-s)
 *  — never hardcode px widths or hex colors in components. */
export const borderWidths = {
  none: "border-0",
  hairline: "border-hairline",
  default: "border",
  medium: "border-medium",
  strong: "border-strong",
} as const;
export const borderWidthPx = { none: 0, hairline: 1, default: 1, medium: 1.5, strong: 2 } as const;
export const borderColors = {
  default: "border-border",
  subtle: "border-border-subtle",
  strong: "border-border-strong",
  focus: "border-border-focus",
  disabled: "border-border-disabled",
  danger: "border-border-danger",
  success: "border-border-success",
} as const;
