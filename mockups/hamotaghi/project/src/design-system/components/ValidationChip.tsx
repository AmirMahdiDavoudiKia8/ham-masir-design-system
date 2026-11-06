'use client';

import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { statusText } from '../tokens';

export type ValidationStatus = 'valid' | 'error' | 'neutral';

const styles: Record<ValidationStatus, { mark: string; bgcolor: string; color: string }> = {
  valid: { mark: '✓', bgcolor: 'success.light', color: statusText.success },
  error: { mark: '✕', bgcolor: 'error.light', color: statusText.error },
  neutral: { mark: '○', bgcolor: 'background.subtle', color: 'text.secondary' },
};

/** Password rule chips from the Figma UI kit, e.g. «✓ حداقل ۸ کاراکتر». */
export function ValidationChip({ status, children }: { status: ValidationStatus; children: ReactNode }) {
  const s = styles[status];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.5,
        py: 0.5,
        borderRadius: (t) => `${t.radius.pill}px`,
        bgcolor: s.bgcolor,
        color: s.color,
        typography: 'caption',
      }}
    >
      <span aria-hidden>{s.mark}</span>
      {children}
    </Box>
  );
}
