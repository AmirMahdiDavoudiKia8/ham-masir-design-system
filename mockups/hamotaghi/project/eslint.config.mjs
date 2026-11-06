import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/**
 * Design-system guard rails. These rules apply to every file EXCEPT
 * `src/design-system/**`, which is the only place allowed to define raw values.
 *
 * They cover the five categories promised in DESIGN_SYSTEM.md §1:
 * color, font family/size/weight, radius, shadow and fixed dimensions.
 * Layout spacing is expressed with `sx` multiples of `theme.spacing`.
 */
const designSystemRules = {
  'no-restricted-syntax': [
    'error',
    {
      selector: 'Literal[value=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
      message: 'رنگ هگز ممنوع است. از theme استفاده کنید: color="primary.main" یا bgcolor="background.paper".',
    },
    {
      selector: 'Literal[value=/^(rgb|rgba|hsl|hsla)\\(/]',
      message: 'رنگ rgb/hsl ممنوع است. از رنگ‌های theme استفاده کنید.',
    },
    {
      selector: 'Property[key.name="fontSize"]',
      message: 'fontSize دستی ممنوع است. از <Typography variant="..."> یا typography: "body2" در sx استفاده کنید.',
    },
    {
      selector: 'Property[key.name="fontFamily"]',
      message: 'fontFamily فقط در دیزاین سیستم تعریف می‌شود.',
    },
    {
      selector: 'Property[key.name="fontWeight"] > Literal[raw=/^[0-9]+$/]',
      message: 'fontWeight عددی ممنوع است. از variant یا fontWeight: "fontWeightBold" استفاده کنید.',
    },
    {
      selector: 'Property[key.name="fontWeight"] > Literal[value=/^[0-9]+$/]',
      message: 'fontWeight عددی ممنوع است. از variant یا fontWeight: "fontWeightBold" استفاده کنید.',
    },
    {
      selector: 'Property[key.name="lineHeight"]',
      message: 'lineHeight دستی ممنوع است. از variant تایپوگرافی استفاده کنید.',
    },
    {
      selector: 'Property[key.name="boxShadow"] > Literal[value=/px|rgba?\\(|#|hsl/]',
      message: 'سایه دستی ممنوع است. از boxShadow: 1 | 3 | 8 استفاده کنید.',
    },
    {
      selector: 'Property[key.name="borderRadius"] > Literal[value=/px/]',
      message: 'گردی پیکسلی ممنوع است. از (t) => `${t.radius.card}px` یا radius توکن استفاده کنید.',
    },
    {
      selector: 'Property[key.name="borderRadius"] > Literal[raw=/^[0-9]+(\\.[0-9]+)?$/]:not([raw="0"])',
      message: 'گردی عددی ممنوع است. از radius توکن استفاده کنید: (t) => `${t.radius.lg}px`.',
    },
    {
      selector: 'Property[key.name="borderRadius"] > Literal[value=/^[0-9]+(\\.[0-9]+)?$/]',
      message: 'گردی عددی ممنوع است. از radius توکن استفاده کنید: (t) => `${t.radius.lg}px`.',
    },
    {
      selector: 'Property[key.name="borderRadius"] TemplateLiteral[expressions.length=0]',
      message: 'گردی ثابت داخل template string ممنوع است. مقدار را از tokens.radius بگیرید.',
    },
  ],
  'no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: '@mui/material/styles',
          importNames: ['createTheme', 'ThemeProvider'],
          message: 'تم فقط در src/design-system ساخته می‌شود.',
        },
      ],
      patterns: [
        { group: ['@/design-system/*'], message: 'فقط از "@/design-system" ایمپورت کنید.' },
        { group: ['tailwindcss', '@tailwindcss/*'], message: 'پروژه با MUI است؛ Tailwind استفاده نمی‌شود.' },
      ],
    },
  ],
};

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/design-system/**'],
    rules: designSystemRules,
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
