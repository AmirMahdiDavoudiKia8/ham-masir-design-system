'use client';

import { alpha, createTheme, type CSSProperties, type Shadows } from '@mui/material/styles';
import {
  borderWidth,
  breakpoints,
  color,
  controlHeight,
  fontFamily,
  fontWeight,
  motion,
  radius,
  rootFontSize,
  shadow,
  spacingUnit,
  statusStroke,
  statusText,
  typeScale,
} from './tokens';

/* ------------------------------------------------------------------ */
/* Type augmentation for our custom theme keys                         */
/* ------------------------------------------------------------------ */

declare module '@mui/material/styles' {
  interface TypographyVariants {
    display: CSSProperties;
  }
  interface TypographyVariantsOptions {
    display?: CSSProperties;
  }
  interface TypeBackground {
    subtle: string;
  }
  interface Theme {
    radius: typeof radius;
  }
  interface ThemeOptions {
    radius?: typeof radius;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function variant(key: keyof typeof typeScale): CSSProperties {
  return { fontFamily, ...typeScale[key] };
}

// MUI expects 25 elevation levels; we collapse them onto our 3 shadows.
const shadows = [
  shadow.none,
  shadow.sm,
  shadow.sm,
  ...Array(5).fill(shadow.md),
  ...Array(17).fill(shadow.lg),
] as Shadows;

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

export const theme = createTheme({
  direction: 'rtl',
  cssVariables: true,
  breakpoints: { values: breakpoints },
  spacing: spacingUnit,
  // sx `borderRadius: n` = n × 8px. Prefer the named `theme.radius` values.
  shape: { borderRadius: radius.sm },
  radius,
  shadows,
  palette: {
    mode: 'light',
    primary: color.primary,
    secondary: color.secondary,
    success: color.success,
    warning: color.warning,
    error: color.error,
    info: color.info,
    text: color.text,
    background: color.background,
    divider: color.divider,
  },
  typography: {
    fontFamily,
    htmlFontSize: rootFontSize,
    fontSize: parseFloat(typeScale.body1.fontSize) * rootFontSize,
    fontWeightRegular: fontWeight.regular,
    fontWeightMedium: fontWeight.medium,
    fontWeightBold: fontWeight.bold,
    display: variant('display'),
    h1: variant('h1'),
    h2: variant('h2'),
    h3: variant('h3'),
    h4: variant('h4'),
    h5: variant('h5'),
    h6: variant('h6'),
    subtitle1: variant('subtitle1'),
    subtitle2: variant('subtitle2'),
    body1: variant('body1'),
    body2: variant('body2'),
    caption: variant('caption'),
    // Persian has no letter case — never uppercase.
    overline: { ...variant('overline'), textTransform: 'none', letterSpacing: 0 },
    button: { ...variant('button'), textTransform: 'none', letterSpacing: 0 },
  },
  transitions: {
    duration: {
      shortest: motion.duration.short,
      shorter: motion.duration.short,
      short: motion.duration.short,
      standard: motion.duration.standard,
      complex: motion.duration.long,
      enteringScreen: motion.duration.standard,
      leavingScreen: motion.duration.short,
    },
    easing: { easeInOut: motion.easing, easeOut: motion.easing, easeIn: motion.easing, sharp: motion.easing },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: { backgroundColor: color.background.default },
        // Numbers, phone numbers and codes read left-to-right even inside RTL text. The RTL plugin
        // flips a CSS `direction`, so the left-to-right part comes from the `dir="ltr"` attribute
        // (PillField sets it); this keeps such inputs aligned to the right like the rest of the form.
        'input[dir="ltr"]': { textAlign: 'end' },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          display: 'h1',
          subtitle1: 'p',
          subtitle2: 'p',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, size: 'medium' },
      styleOverrides: {
        root: {
          borderRadius: radius.pill,
          minHeight: controlHeight.medium,
          paddingInline: spacingUnit * 2,
          // Colored glow under filled buttons, per the Figma shadow tokens.
          variants: [
            { props: { variant: 'contained', color: 'primary' }, style: { '&:not(.Mui-disabled)': { boxShadow: shadow.primaryBlue } } },
            { props: { variant: 'contained', color: 'secondary' }, style: { '&:not(.Mui-disabled)': { boxShadow: shadow.ctaAmber } } },
            // White text on the bright Figma red is 3.76:1, which fails AA at button size.
            { props: { variant: 'contained', color: 'error' }, style: { backgroundColor: statusText.error } },
            // Figma «Disabled State»: flat slate pill, not a faded brand color.
            {
              props: { variant: 'contained' },
              style: { '&.Mui-disabled': { backgroundColor: color.divider, color: color.text.disabled, boxShadow: 'none' } },
            },
            // Figma «Loading»: soft amber with a spinner beside the label (use loadingPosition="start").
            {
              props: { variant: 'contained', color: 'secondary' },
              style: { '&.MuiButton-loading.Mui-disabled': { backgroundColor: color.secondary.light, color: color.secondary.contrastText } },
            },
          ],
        },
        sizeSmall: { minHeight: controlHeight.small, paddingInline: spacingUnit * 1.5, fontSize: typeScale.body2.fontSize },
        sizeLarge: { minHeight: controlHeight.large, paddingInline: spacingUnit * 3 },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: radius.pill } },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'medium', fullWidth: true },
    },
    MuiFormControl: {
      defaultProps: { fullWidth: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.pill,
          backgroundColor: color.background.paper,
          paddingInline: spacingUnit * 0.5,
          '&.MuiInputBase-multiline': { borderRadius: radius.lg },
        },
        notchedOutline: { borderColor: color.border },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: typeScale.body2.fontSize,
          '&.Mui-error': { color: statusText.error },
        },
        // Keep the floating label clear of the pill's rounded edge.
        outlined: { insetInlineStart: spacingUnit * 0.75 },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginInline: spacingUnit * 2,
          fontSize: typeScale.body2.fontSize,
          lineHeight: typeScale.body2.lineHeight,
          '&.Mui-error': { color: statusText.error },
        },
      },
    },
    MuiPaper: {
      styleOverrides: { rounded: { borderRadius: radius.card } },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { borderRadius: radius.card, borderColor: color.divider } },
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: spacingUnit * 3, '&:last-child': { paddingBottom: spacingUnit * 3 } } },
    },
    MuiCardActions: {
      styleOverrides: { root: { padding: spacingUnit * 3, paddingTop: 0, gap: spacingUnit } },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: radius.pill, fontWeight: fontWeight.semibold, fontSize: typeScale.body2.fontSize },
        sizeSmall: { fontSize: typeScale.caption.fontSize, fontWeight: typeScale.caption.fontWeight },
      },
    },
    // Segmented control: a muted pill track; the selected segment is filled amber (Figma «تاگل»).
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { backgroundColor: color.background.subtle, borderRadius: radius.pill, padding: spacingUnit * 0.5, gap: spacingUnit * 0.5 },
        firstButton: { borderRadius: radius.pill, border: 0, margin: 0 },
        middleButton: { borderRadius: radius.pill, border: 0, margin: 0 },
        lastButton: { borderRadius: radius.pill, border: 0, margin: 0 },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          border: 0,
          borderRadius: radius.pill,
          fontWeight: fontWeight.bold,
          fontSize: typeScale.body1.fontSize,
          minHeight: controlHeight.small + spacingUnit * 0.5,
          color: color.text.secondary,
          '&.Mui-disabled': { border: 0 },
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: color.secondary.main,
            color: color.secondary.contrastText,
          },
          variants: [
            {
              props: { color: 'error' },
              style: { '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: statusText.error, color: color.background.paper } },
            },
          ],
        },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: radius.card } },
    },
    MuiDialogTitle: {
      defaultProps: { variant: 'h3' },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          alignItems: 'center',
          border: `${borderWidth.hairline}px solid transparent`,
          // Figma «Toast / Inline Alerts»: tinted background with a thin border in the same hue.
          // Text and icon use the accessible status roles instead of the bright -500 colors.
          variants: (['success', 'error', 'info', 'warning'] as const).map((severity) => ({
            props: { variant: 'standard', severity },
            style: {
              backgroundColor: color[severity].light,
              borderColor: alpha(color[severity].main, 0.35),
              color: statusText[severity],
              '& .MuiAlert-icon': { color: statusStroke[severity] },
            },
          })),
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: { tooltip: { fontSize: typeScale.caption.fontSize, borderRadius: radius.sm } },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: spacingUnit, borderRadius: radius.pill, backgroundColor: color.divider },
        bar: { borderRadius: radius.pill },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { borderBottom: `${borderWidth.hairline}px solid ${color.divider}`, backgroundColor: color.background.paper },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: fontWeight.semibold, color: color.text.secondary, fontSize: typeScale.body2.fontSize },
        root: { fontSize: typeScale.body2.fontSize, borderColor: color.divider },
      },
    },
    MuiAvatar: {
      styleOverrides: { root: { fontWeight: fontWeight.semibold, fontSize: typeScale.h3.fontSize } },
    },
  },
});

export type AppTheme = typeof theme;
