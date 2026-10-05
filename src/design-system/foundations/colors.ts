/** Foundations: color — semantic roles components may use.
 *  Legacy roles preserved; v2 adds canvas / action / feedback / link / info. */
export const colors = {
  brand: ["primary", "primary-hover", "primary-soft", "secondary", "secondary-soft"],
  surface: ["background", "surface", "surface-alt", "muted", "canvas", "surface-raised", "surface-sunken"],
  text: ["foreground", "muted-foreground", "foreground-faint", "link", "inverse", "text-disabled"],
  line: ["border", "border-strong", "border-subtle", "border-focus", "border-disabled", "border-danger", "border-success"],
  action: ["action-primary", "action-primary-hover", "action-primary-pressed", "action-secondary", "action-ghost-hover"],
  feedback: ["feedback-success-bg", "feedback-warning-bg", "feedback-danger-bg", "feedback-info-bg"],
  functional: ["verified", "verified-strong", "success", "success-strong", "alert", "alert-strong", "danger", "danger-strong", "info", "scrim"],
} as const;
export type ColorRole = (typeof colors)[keyof typeof colors][number];
