/** Foundations: motion — patient, accompanying; never bounce/spring. */
export const motion = {
  micro: "150ms",
  standard: "250ms",
  entrance: "350ms",
  sheet: "340ms",
  easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
} as const;
export type MotionToken = keyof typeof motion;
