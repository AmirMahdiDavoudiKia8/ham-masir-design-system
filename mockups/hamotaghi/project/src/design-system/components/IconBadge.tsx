'use client';

import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { color, size, statusStroke } from '../tokens';

const tones = {
  primary: { halo: color.brand.soft, fill: color.primary.main },
  error: { halo: color.error.light, fill: statusStroke.error },
  success: { halo: color.success.light, fill: statusStroke.success },
} as const;

/**
 * The large round icon at the top of the OTP screens (Figma frames 3 and 7):
 * a filled circle inside a soft halo (--primary-200 for the normal state, red for the error state).
 */
export function IconBadge({ tone = 'primary', children }: { tone?: keyof typeof tones; children: ReactNode }) {
  const t = tones[tone];
  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        width: size.iconBadge.halo,
        height: size.iconBadge.halo,
        borderRadius: '50%',
        bgcolor: t.halo,
        alignSelf: 'center',
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          width: size.iconBadge.core,
          height: size.iconBadge.core,
          borderRadius: '50%',
          bgcolor: t.fill,
          color: color.background.paper,
          '& svg': { fontSize: size.iconBadge.icon },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
