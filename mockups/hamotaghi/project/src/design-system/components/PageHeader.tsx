'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  /** Buttons shown at the end of the row (left side in RTL). */
  actions?: ReactNode;
};

/** The title block at the top of every page. Always `h1` — never pick a heading size per page. */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ mb: 4, alignItems: { xs: 'stretch', sm: 'flex-end' }, justifyContent: 'space-between' }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
      {actions && (
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}
