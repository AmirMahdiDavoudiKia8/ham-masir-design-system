'use client';

import Box, { type BoxProps } from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { AppIcons } from '../icons';
import { borderWidth, size } from '../tokens';

type MobileFrameProps = Omit<BoxProps, 'title'> & {
  /** Nav header title, e.g. «اعتبارسنجی شماره». Omit on the first screens («شروع کنید»). */
  title?: string;
  /** Heading level for the frame title. In the real app it is the page `h1`; in a gallery use `h2`. */
  titleComponent?: 'h1' | 'h2';
  /** Shows the round back button (chevron-right-rtl) at the start of the header. */
  onBack?: () => void;
  /** Pinned to the bottom of the frame, e.g. the «ورود به عنوان ادمین» link. */
  footer?: ReactNode;
  children: ReactNode;
};

/**
 * The white phone-sized card every auth screen sits in (Figma frames 1–9):
 * 40px corners (--radius-screen) and the card shadow, centered on the canvas.
 */
export function MobileFrame({
  title,
  titleComponent = 'h1',
  onBack,
  footer,
  children,
  sx,
  ...props
}: MobileFrameProps) {
  return (
    <Box
      sx={[
        {
          width: '100%',
          maxWidth: size.mobileFrame.width,
          mx: 'auto',
          minHeight: size.mobileFrame.minHeight,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderRadius: (t) => `${t.radius.screen}px`,
          boxShadow: 8,
          px: 3,
          py: 4,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {(title || onBack) && (
        <Stack
          direction="row"
          sx={{ alignItems: 'center', mb: 3, position: 'relative', minHeight: size.mobileFrame.backButton }}
        >
          {onBack && (
            <IconButton
              aria-label="بازگشت"
              onClick={onBack}
              sx={{
                border: borderWidth.hairline,
                borderColor: 'divider',
                width: size.mobileFrame.backButton,
                height: size.mobileFrame.backButton,
                borderRadius: '50%',
              }}
            >
              <AppIcons.chevronRightRtl />
            </IconButton>
          )}
          {title && (
            <Typography
              variant="h3"
              component={titleComponent}
              sx={{ position: 'absolute', insetInline: size.mobileFrame.titleInset, textAlign: 'center' }}
            >
              {title}
            </Typography>
          )}
        </Stack>
      )}
      <Box sx={{ flex: 1 }}>{children}</Box>
      {footer && <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>{footer}</Box>}
    </Box>
  );
}
