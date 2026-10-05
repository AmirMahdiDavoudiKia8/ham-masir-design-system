type ClassValue = string | number | false | null | undefined;

/** Joins conditional class names, skipping falsy values. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
