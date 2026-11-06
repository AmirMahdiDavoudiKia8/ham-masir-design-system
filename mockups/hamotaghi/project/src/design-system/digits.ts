const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/**
 * Show numbers with Persian digits: faDigits(86) → «۸۶».
 * Estedad draws whatever digit characters it is given, so numbers coming from
 * the API must go through this before they are rendered.
 */
export function faDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/** The reverse, for input typed on a Persian keyboard: «۰۹۱۲» → "0912". Use before sending to the API. */
export function enDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}
