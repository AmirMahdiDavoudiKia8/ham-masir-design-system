/** Next.js searchParams values are string | string[] | undefined — this normalizes to a single string. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
