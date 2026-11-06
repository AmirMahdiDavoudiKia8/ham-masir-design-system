'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { borderWidth, color } from '../tokens';

/** «سلام سجاد موسوی عزیز! 👋» greeting box from Figma frames 4 and 8 (--primary-50, --radius-card). */
export function WelcomeBox({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <Box
      sx={{
        bgcolor: color.brand.tint,
        border: borderWidth.hairline,
        borderColor: color.brand.soft,
        borderRadius: (t) => `${t.radius.card}px`,
        p: 2,
      }}
    >
      <Typography variant="h3" component="p" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {children && (
        <Typography variant="body2" color="text.secondary">
          {children}
        </Typography>
      )}
    </Box>
  );
}
