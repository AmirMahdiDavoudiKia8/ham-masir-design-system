/**
 * Design tokens — the single source of truth for every visual value.
 *
 * Nothing outside `src/design-system/` may hard-code a color, font family,
 * font size, font weight, radius, border width, shadow or fixed component
 * size. Use the MUI theme (which is built from these tokens) via `sx`,
 * `styled` or `useTheme()` instead.
 *
 * The enforcement lives in `eslint.config.mjs`; see DESIGN_SYSTEM.md §1.
 */

/* ------------------------------------------------------------------ */
/* Color                                                               */
/* ------------------------------------------------------------------ */

/**
 * Raw scales, from the designer's Figma board («توکن‌های طراحی سامانه تطبیق هم‌اتاقی»).
 * Components should use semantic roles (palette.primary …), not these directly.
 */
export const colorScale = {
  /** Primary — Academic Cobalt */
  cobalt: {
    50: '#EFF6FF', // tint: welcome card background
    200: '#DBEAFE', // soft: icon halos, guide boxes
    500: '#3B82F6', // mid: active links and icons
    700: '#1D4ED8', // default: brand, focused fields, active OTP circle
    900: '#1E3A8A', // dark: header panels, dark surfaces
  },
  /** Complementary — Warm Amber */
  amber: {
    50: '#FEF3C7', // tint: "manageable difference" tags
    200: '#FDE68A', // soft: warning badges, loading button
    500: '#F59E0B', // main: primary CTA buttons, toggles, active state
    600: '#D97706', // hover / pressed CTA
    700: '#EA580C', // deep: strong emphasis, countdown timer
    800: '#92400E', // text-safe warning (AA on white)
  },
  /** Slate — surfaces, text and borders */
  slate: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  green: { 50: '#ECFDF5', 500: '#10B981', 600: '#059669', 700: '#047857' },
  red: { 50: '#FEF2F2', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C' },
} as const;

/** Semantic color roles — these map 1:1 onto the MUI palette. */
export const color = {
  /** Brand blue: admin panel buttons, links, focus, selected state. */
  primary: { light: colorScale.cobalt[500], main: colorScale.cobalt[700], dark: colorScale.cobalt[900], contrastText: '#FFFFFF' },
  /** Amber CTA: the main call-to-action on student screens. Dark text (white fails contrast on amber). */
  secondary: { light: colorScale.amber[200], main: colorScale.amber[500], dark: colorScale.amber[600], contrastText: colorScale.slate[900] },
  success: { light: colorScale.green[50], main: colorScale.green[500] },
  warning: { light: colorScale.amber[50], main: colorScale.amber[600], dark: colorScale.amber[700] },
  error: { light: colorScale.red[50], main: colorScale.red[500] },
  info: { light: colorScale.cobalt[50], main: colorScale.cobalt[500], dark: colorScale.cobalt[700] },
  text: {
    primary: colorScale.slate[900],
    secondary: colorScale.slate[600],
    disabled: colorScale.slate[400],
  },
  background: {
    default: colorScale.slate[50], // --surface-canvas
    paper: colorScale.slate[0], // --surface-card
    subtle: colorScale.slate[100], // --surface-muted
  },
  /** Input, OTP-circle and chip outlines (--border-default). */
  border: colorScale.slate[300],
  divider: colorScale.slate[200],
  /**
   * Brand tint surfaces that do not map onto a standard MUI palette role:
   * welcome cards and the soft halos behind icons.
   */
  brand: {
    tint: colorScale.cobalt[50],
    soft: colorScale.cobalt[200],
  },
} as const;

/**
 * Text-safe status colors. The Figma `-500` colors are bright and fail AA
 * when used as small text, so text uses these darker roles.
 * Every value is >= 4.5:1 on white and on the matching `*.light` surface.
 */
export const statusText = {
  success: colorScale.green[700],
  warning: colorScale.amber[800],
  error: colorScale.red[700],
  info: colorScale.cobalt[700],
} as const;

/**
 * Status colors for non-text graphics (rings, icons, borders). These keep the
 * brand hue while staying >= 3:1 against white, as WCAG 1.4.11 requires.
 */
export const statusStroke = {
  success: colorScale.green[600],
  warning: colorScale.amber[600],
  error: colorScale.red[600],
  info: colorScale.cobalt[500],
} as const;

/**
 * The Figma palette exactly as the designer laid it out: same groups, token
 * names, order (right to left) and usage notes. Used by the /design-system page
 * so the two can be compared side by side. Values come from `colorScale`.
 */
export const figmaPalette = [
  {
    title: 'رنگ اول / اصلی (Primary – Academic Cobalt)',
    swatches: [
      { token: '--primary-900 (Dark)', value: colorScale.cobalt[900], usage: 'پس‌زمینه پنل برندینگ، هدرهای تیره' },
      { token: '--primary-700 (Default)', value: colorScale.cobalt[700], usage: 'رنگ اصلی برند، فوکوس فیلد، دایره فعال OTP' },
      { token: '--primary-500 (Mid)', value: colorScale.cobalt[500], usage: 'لینک‌های فعال، آیکون‌های انتخاب‌شده' },
      { token: '--primary-200 (Soft)', value: colorScale.cobalt[200], usage: 'لایه بیرونی آیکون‌ها، کادر باکس‌های راهنما' },
      { token: '--primary-50 (Tint)', value: colorScale.cobalt[50], usage: 'پس‌زمینه کارت خوش‌آمدگویی دانشجو' },
    ],
  },
  {
    title: 'رنگ دوم / مکمل (Complementary – Warm Amber)',
    swatches: [
      { token: '--complement-700 (Deep)', value: colorScale.amber[700], usage: 'تأکید بالا، تایمر شمارش معکوس' },
      { token: '--complement-600 (Hover)', value: colorScale.amber[600], usage: 'حالت Hover دکمه‌های اصلی کپسولی' },
      { token: '--complement-500 (Main)', value: colorScale.amber[500], usage: 'دکمه‌های اصلی (CTA)، تاگل فعال، امتیاز مچینگ' },
      { token: '--complement-200 (Soft)', value: colorScale.amber[200], usage: 'کادر بج‌های هشدار و اولویت متوسط' },
      { token: '--complement-50 (Tint)', value: colorScale.amber[50], usage: 'پس‌زمینه تگ‌های «تفاوت قابل مدیریت»' },
    ],
  },
  {
    title: 'رنگ‌های وضعیت و معنایی (Semantic Status)',
    swatches: [
      { token: '--semantic-success', value: colorScale.green[500], usage: 'تأیید رمز عبور، سازگاری بالا، تیک سبز' },
      { token: '--semantic-success-bg', value: colorScale.green[50], usage: 'پس‌زمینه چیپ‌های تأییدشده' },
      { token: '--semantic-error', value: colorScale.red[500], usage: 'خط قرمز (Hard Constraint)، خطای فرم' },
      { token: '--semantic-error-bg', value: colorScale.red[50], usage: 'پس‌زمینه پیام خطا و بج خط قرمز' },
      { token: '--semantic-info', value: colorScale.cobalt[500], usage: 'نکات راهنمای پرسشنامه و اعلان‌ها' },
    ],
  },
] as const;

/** Figma section 2: surfaces, text colors and borders, in the designer's order. */
export const figmaSurfaces = [
  { token: '--surface-canvas', label: 'Slate 50', value: colorScale.slate[50], usage: 'پس‌زمینه اصلی صفحات وب و اپلیکیشن' },
  { token: '--surface-card', label: 'Pure White', value: colorScale.slate[0], usage: 'پس‌زمینه فریم‌های موبایل، کارت‌ها و اینپوت‌ها' },
  { token: '--surface-muted', label: 'Slate 100', value: colorScale.slate[100], usage: 'پس‌زمینه کانتینر تاگل (ثبت‌نام/ورود) و دکمه ادمین' },
  { token: '--text-primary', label: 'Slate 900', value: colorScale.slate[900], usage: 'رنگ اصلی تیترها، اعداد OTP و متن ورودی‌ها' },
  { token: '--text-secondary', label: 'Slate 600', value: colorScale.slate[600], usage: 'رنگ زیرتیترها، توضیحات راهنما و لینک ادمین' },
  { token: '--border-default', label: 'Slate 300 / 200', value: colorScale.slate[300], usage: 'خط دور فیلدهای کپسولی، دایره‌های OTP و Divider' },
] as const;

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

/** Estedad (استعداد), self-hosted from `@fontsource-variable/estedad` — see `font.ts`. */
export const fontFamily = "'Estedad Variable', Estedad, Tahoma, system-ui, sans-serif";

/** Browser root font size, used to print the rem-based type scale in px. */
export const rootFontSize = 16;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/**
 * The type scale, from the Figma board («مقیاس تایپوگرافی — فونت استعداد»).
 * Sizes are identical on every screen size. 1rem = 16px.
 *
 * The designer defined 7 styles; MUI variants map onto them like this.
 * h4–h6 are aliases of h3 so MUI internals that use them stay on-scale —
 * in our own code use only display/h1, h2, h3.
 */
export const typeScale = {
  display: { fontSize: '1.5rem', lineHeight: '36px', fontWeight: fontWeight.extrabold }, // Display / H1 — 24/36
  h1: { fontSize: '1.5rem', lineHeight: '36px', fontWeight: fontWeight.extrabold }, // Display / H1 — 24/36
  h2: { fontSize: '1.1875rem', lineHeight: '30px', fontWeight: fontWeight.bold }, // Heading 2 — 19/30
  h3: { fontSize: '1rem', lineHeight: '26px', fontWeight: fontWeight.bold }, // Title / Nav Header — 16/26
  h4: { fontSize: '1rem', lineHeight: '26px', fontWeight: fontWeight.bold }, // alias of h3
  h5: { fontSize: '1rem', lineHeight: '26px', fontWeight: fontWeight.bold }, // alias of h3
  h6: { fontSize: '1rem', lineHeight: '26px', fontWeight: fontWeight.bold }, // alias of h3
  subtitle1: { fontSize: '0.875rem', lineHeight: '24px', fontWeight: fontWeight.bold }, // Body size, bold — form/group labels
  subtitle2: { fontSize: '0.8125rem', lineHeight: '22px', fontWeight: fontWeight.semibold }, // Helper size, semibold — small labels
  body1: { fontSize: '0.875rem', lineHeight: '24px', fontWeight: fontWeight.medium }, // Body / Input Text — 14/24
  body2: { fontSize: '0.8125rem', lineHeight: '22px', fontWeight: fontWeight.regular }, // Subtitle / Helper — 13/22
  caption: { fontSize: '0.6875rem', lineHeight: '18px', fontWeight: fontWeight.semibold }, // Caption / Badge — 11/18
  overline: { fontSize: '0.6875rem', lineHeight: '18px', fontWeight: fontWeight.semibold }, // same as caption
  button: { fontSize: '0.9375rem', lineHeight: '24px', fontWeight: fontWeight.bold }, // Button / Active Tab — 15/24
} as const;

/* ------------------------------------------------------------------ */
/* Spacing, radius, elevation, sizing                                  */
/* ------------------------------------------------------------------ */

/** Base unit: `theme.spacing(1)` = 8px. Use multiples only: 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8. */
export const spacingUnit = 8;

/** Corner radius, from the Figma board («شعاع قوس‌ها»). */
export const radius = {
  xs: 4,
  sm: 8,
  md: 12, // small inner elements: tooltips, multiline text areas
  lg: 16, // alerts / toasts, stat icons
  card: 24, // --radius-card: cards, dialogs, welcome box
  screen: 40, // --radius-screen: main mobile frame card
  pill: 999, // --radius-pill: buttons, inputs, toggles, chips
} as const;

/** Border widths, so 1px and 1.5px outlines do not drift between components. */
export const borderWidth = {
  hairline: 1,
  thick: 1.5,
} as const;

/**
 * Fixed dimensions of design-system components. These are not spacing values:
 * they describe the physical size of an icon, avatar, badge or frame.
 */
export const size = {
  icon: { xs: 14, sm: 16, md: 20, lg: 24, xl: 28, xxl: 32 },
  avatar: { sm: 40, md: 48 },
  iconContainer: 40,
  emptyStateIcon: 64,
  emptyStateText: 360,
  iconBadge: { halo: 88, core: 60, icon: 28 },
  mobileFrame: { width: 400, minHeight: 640, backButton: 40, titleInset: 48 },
  matchScore: {
    small: { box: 48, thickness: 4 },
    medium: { box: 72, thickness: 4.5 },
    large: { box: 112, thickness: 5 },
  },
} as const;

export const shadow = {
  none: 'none',
  sm: '0 1px 3px rgba(15, 23, 42, 0.08)',
  md: '0 8px 24px rgba(15, 23, 42, 0.08)',
  lg: '0 20px 45px rgba(15, 23, 42, 0.08)', // --shadow-card
  /** Under amber CTA buttons (--shadow-cta-amber). */
  ctaAmber: '0 8px 20px rgba(245, 158, 11, 0.28)',
  /** Under blue primary buttons (--shadow-primary-blue). */
  primaryBlue: '0 6px 16px rgba(29, 78, 216, 0.28)',
} as const;

/** Control heights, so a button sits flush next to an input of the same size. */
export const controlHeight = {
  small: 32,
  medium: 40,
  large: 48,
} as const;

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

/** Max content width for `PageContainer`. */
export const layout = {
  maxWidth: 'lg',
  pagePaddingY: { xs: 3, md: 5 },
  sectionGap: 3,
} as const;

export const motion = {
  duration: { short: 150, standard: 250, long: 400 },
  easing: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

/* ------------------------------------------------------------------ */
/* Domain                                                              */
/* ------------------------------------------------------------------ */

/** Compatibility score thresholds (0–100) and the palette role each maps to. */
export const matchScoreLevels = [
  { min: 75, role: 'success', label: 'سازگاری بالا' },
  { min: 50, role: 'warning', label: 'سازگاری متوسط' },
  { min: 0, role: 'error', label: 'سازگاری پایین' },
] as const;
